/**
 * The `DashboardInicio` component in React fetches and displays various statistics and data related to
 * inventory, sales, and performance, with options to filter by date and generate PDF reports.
 * @returns The `DashboardInicio` component is being returned. It contains various sections displaying
 * different statistics and data related to inventory, sales, top products, vendor performance, and
 * sales details. The component fetches data from API endpoints based on selected filters for date
 * range and then displays the information in different sections using icons and charts. Additionally,
 * it provides functionality to generate PDF reports for critical stock and sales details of the
 */
import React, { useEffect, useState } from "react";
import { AiTwotoneDollar } from "react-icons/ai";
import { FaBoxes, FaChartLine, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import "./DashboardInicio.css";
import Ventas from "../Ventas/Venta";
import { data } from "react-router-dom";
import jsPDF from "jspdf";
import Button from "../Button/Button";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardInicio = () => {
  /* The above code is using React's useState hook to initialize multiple state variables in a
  functional component. Here is a breakdown of each state variable: */
  const [datos, setDatos] = useState({
    gananciaInventario: null,
    valorInventario: null,
    productosStock: [],
    productosMarca: [],
    stockCritico: [],
    stockPorDistribuidor: [],
    ventasSemanales: [],
    ventasResumen: null,
    rendimientoVendedores: [],
    topClientes: null,
    clientesNuevosVsRecurrentes: null,
    margenProductos: null,
    historialVentas: null,
    topProductos: [],
    ventasPorDiaProducto: null,
    detalleVentaPorDia: [],
  });

  const [error, setError] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("dia");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroStock, setFiltroStock] = useState("general");

  /**
   * The function `fetchDatos` is an asynchronous function that fetches data from multiple API
   * endpoints based on certain conditions and updates the state with the retrieved data.
   */
  const fetchDatos = async () => {
    try {
      const fechasQuery = fechaInicio && fechaFin
        ? `?desde=${fechaInicio}&hasta=${fechaFin}`
        : `?filtro=${fechaFiltro}`;

      const [inventarioRes, stockRes, ventasRes, rendimientoRes, stockCriticoRes, topVentaRes] = await Promise.all([
        fetch(`http://localhost:3000/api/informes/valor-total-inventario`),
        fetch(`http://localhost:3000/api/informes/productos-stock`),
        fetch(`http://localhost:3000/api/informes/ventas-semanales${fechasQuery}`),
        fetch(`http://localhost:3000/api/informes/ventas-por-vendedor${fechasQuery}`),
        fetch(`http://localhost:3000/api/informes/stock-critico`),
        fetch(`http://localhost:3000/api/informes/top-productos${fechasQuery}`),
      ]);

      let detalleVentaPorDia = [];
      if (fechaFiltro === "dia" && fechaInicio) {
        const detalleVentaPorDiaRes = await fetch(`http://localhost:3000/api/informes/ventas/detalle-dia?fecha=${fechaInicio}`);
        detalleVentaPorDia = await detalleVentaPorDiaRes.json();
      }

      const [inventario, stock, ventas, rendimiento, stockCritico, topVenta] = await Promise.all([
        inventarioRes.json(),
        stockRes.json(),
        ventasRes.json(),
        rendimientoRes.json(),
        stockCriticoRes.json(),
        topVentaRes.json()
      ]);
      console.log("TOP VENTA", topVentaRes)

      const stockPorDistribuidor = {};
      if (Array.isArray(stockCritico)) {
        stockCritico.forEach((producto) => {
          if (!stockPorDistribuidor[producto.nombre_distribuidor]) {
            stockPorDistribuidor[producto.nombre_distribuidor] = [];
          }
          stockPorDistribuidor[producto.nombre_distribuidor].push(producto);
        });
      }

      setDatos(prev => ({
        ...prev,
        valorInventario: inventario.valor_inventario,
        gananciaInventario: inventario.ganancia_inventario,
        productosStock: stock,
        ventasSemanales: ventas,
        rendimientoVendedores: rendimiento,
        topProductos: topVenta,
        detalleVentaPorDia: detalleVentaPorDia,
        stockCritico: stockCritico || [],
        stockPorDistribuidor,
      }));
    } catch (err) {
      console.error(err);
      setError("Error al cargar estadísticas");
    }
  };

  /**
   * The function `generarPDFStockCritico` generates a PDF report displaying critical stock information
   * grouped by distributor.
   */
  const generarPDFStockCritico = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Stock Crítico por Distribuidor", 14, 20);

    let y = 30;

    const distribuidores = datos.stockCritico.reduce((acc, producto) => {
      if (!acc[producto.nombre_distribuidor]) {
        acc[producto.nombre_distribuidor] = [];
      }
      acc[producto.nombre_distribuidor].push(producto);
      return acc;
    }, {});

    Object.entries(distribuidores).forEach(([dist, productos]) => {
      doc.setFontSize(12);
      doc.text(`Distribuidor: ${dist}`, 14, y);
      y += 7;

      productos.forEach((p) => {
        const texto = `- [${p.codigo_producto}] ${p.nombre_producto} | Stock: ${p.stock} (Min: ${p.stock_minimo})`;
        doc.text(texto, 20, y);
        y += 6;
      });

      y += 5; // espacio extra entre distribuidores
    });

    doc.save("stock_critico.pdf");
  };

  /**
   * The function `generarPDFVentas` generates a PDF document displaying details of daily sales,
   * including product information and total sales for the day.
   */
  const generarPDFVentas = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Detalle de Ventas del Día", 14, 20);

    let y = 30;

    doc.setFontSize(12);
    doc.text("Fecha | Código | Producto | Cant | Precio U | Costo U | Total | Ganancia", 14, y);
    y += 10;

    let totalGanancia = 0;

    datos.detalleVentaPorDia.forEach((venta) => {
      const precioU = parseFloat(venta.precio_unitario);
      const totalLinea = parseFloat(venta.total_linea);
      const gananciaProducto1 = parseFloat(venta.precio_compra);
      const ganancia = (precioU - gananciaProducto1) * venta.cantidad;

      totalGanancia += ganancia;

      const texto = `${venta.fecha} | ${venta.codigo_producto} | ${venta.nombre_producto} | ${venta.cantidad} | $${precioU.toFixed(2)} | $${totalLinea.toFixed(2)} | $${ganancia.toFixed(2)}`;

      doc.text(texto, 14, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text(`Total del Día: $${totalDelDia.toFixed(2)}`, 14, y + 10);

    doc.setTextColor(0, 128, 0);
    doc.text(`Ganancia del Día: $${gananciaDelDia.toFixed(2)}`, 14, y + 20);

    doc.save("detalle_ventas.pdf");
  };


  const gananciaDelDia = datos.detalleVentaPorDia.reduce((acc, venta) => {
    const gananciaProducto = (parseFloat(venta.precio_unitario) - parseFloat(venta.precio_compra)) * venta.cantidad;
    return acc + gananciaProducto;
  }, 0);


  /* The above code is written in JavaScript and it seems to be a part of a React component using the
  useEffect hook. Here's a breakdown of what the code is doing: */
  useEffect(() => {
    fetchDatos();
  }, [fechaFiltro, fechaInicio, fechaFin]);

  const totalDelDia = datos.detalleVentaPorDia.reduce(
    (acc, venta) => acc + parseFloat(venta.total_linea),
    0
  );


  /* The above code is a React component that represents a dashboard layout for displaying various
  information related to inventory management and sales data. Here is a summary of what the code is
  doing: */

  return (
    <div class="grid-layout">
      <div class="item item-1">

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="filtros-fecha">
          <div className="filtro-select">

            <label>Filtro de Fecha:</label>
            <select value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)}>
              <option value="dia">Día</option>
              <option value="semana">Semana</option>
              <option value="mes">Mes</option>
            </select>
          </div>

          {fechaFiltro === "dia" && (
            <div className="filtro-fecha-dia">
              <label>Fecha:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
          )}

          {(fechaFiltro === "semana" || fechaFiltro === "mes") && (
            <div className="filtro-fechas-rango">
              <div>
                <label>Desde:</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <label>Hasta:</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="item item-2">
        <div className="seccion-header">
          <AiTwotoneDollar />
          <h3>Valor del Inventario</h3>
          <h4>
            {datos.valorInventario
              ? `$${parseFloat(datos.valorInventario).toLocaleString()}`
              : "Cargando..."}
          </h4>
          <h3 style={{ color: "green" }}>
            Ganancia Potencial:{" "}
            {datos.gananciaInventario
              ? `$${parseFloat(datos.gananciaInventario).toLocaleString()}`
              : "Cargando..."}
          </h3>
        </div>
      </div>

      <div className="item item-3">
        <div className="seccion-header">
          <FaMoneyBillWave />
          <h3>Ventas Totales ({fechaFiltro})</h3>
          <h4>
            {datos.ventasSemanales && datos.ventasSemanales.length > 0
              ? `$${parseFloat(datos.ventasSemanales[0].total_semanal).toLocaleString()}`
              : "Cargando..."}
          </h4>
          {datos.ventasSemanales && datos.ventasSemanales.length > 0 && (

            <ResponsiveContainer>
              <LineChart data={datos.ventasSemanales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_semanal" stroke="#8b00c1" />
              </LineChart>
            </ResponsiveContainer>

          )}
        </div>


      </div>

      <div class="item item-4">
        <FaChartLine />
        <h3>Stock Crítico</h3>
        <div className="seccion-contenido1" style={{ gap: '10px' }}>


          <div className="columna-dist">
            <h4>Por distribuidor:</h4>
            {Array.isArray(datos.stockCritico) && datos.stockCritico.length > 0 ? (
              Object.entries(
                datos.stockCritico.reduce((acc, producto) => {
                  if (!acc[producto.nombre_distribuidor]) {
                    acc[producto.nombre_distribuidor] = [];
                  }
                  acc[producto.nombre_distribuidor].push(producto);
                  return acc;

                }, {})
              ).map(([distribuidor, productos]) => (
                <div key={distribuidor} style={{ marginBottom: '1rem' }}>
                  <strong>{distribuidor}</strong>
                  <ul>
                    {productos.map((producto) => (
                      <li key={producto.id_producto}>
                        {producto.codigo_producto ? `[${producto.codigo_producto}] ` : ''}
                        {producto.nombre_producto} - Stock: {producto.stock} (Min: {producto.stock_minimo})
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>Cargando...</p>
            )}
          </div>

          <Button
            onClick={generarPDFStockCritico}
            className="btn-generar-pdf"

          >
            Generar PDF
          </Button>

        </div>

      </div>
      <div class="item item-5">
        <FaBoxes />
        <h3>Top 10 Productos mas vendidos</h3>
        <div className="top">
          {Array.isArray(datos.topProductos) && datos.topProductos.length > 0 ? (
            <ul>
              {datos.topProductos.map((prod, dv) => (
                <li key={prod.id_producto}>
                  Nombre: {prod.nombre_producto} -Cantidad: {prod.vendidos}
                </li>
              ))}
            </ul>
          ) : (
            <h4>
              <p>Cargando...</p>
            </h4>
          )}
        </div>
      </div>
      <div class="item item-6"> <FaBoxes />
        <h3>Rendimiento Vendedores</h3>

        {Array.isArray(datos.rendimientoVendedores) && datos.rendimientoVendedores.length > 0 ? (
          <ul>
            {datos.rendimientoVendedores.map((v, index) => (
              <li key={index}>
                <strong>{v.nombre}:</strong> ${parseFloat(v.total_vendido).toLocaleString()} — {v.ventas} ventas
              </li>
            ))}
          </ul>
        ) : (
          <h4>
            <p>Cargando...</p>
          </h4>
        )}
      </div>
      <div class="item item-7"><FaMoneyBillWave />
        <h3>Detalle de Ventas  ({fechaFiltro})</h3>
        {Array.isArray(datos.detalleVentaPorDia) && datos.detalleVentaPorDia.length > 0 ? (
          <>
            <div className=" tabla-c">
              <table className="tabla-ventas-dia">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total Línea</th>
                    <th>Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.detalleVentaPorDia.map((venta, idx) => {
                    const ganancia = (parseFloat(venta.precio_unitario) - parseFloat(venta.precio_compra)) * venta.cantidad;
                    return (
                      <tr key={idx}>
                        <td>{venta.fecha}</td>
                        <td>{venta.codigo_producto}</td>
                        <td>{venta.nombre_producto}</td>
                        <td>{venta.cantidad}</td>
                        <td>${parseFloat(venta.precio_unitario).toFixed(2)}</td>
                        <td>${parseFloat(venta.total_linea).toFixed(2)}</td>
                        <td style={{ color: 'green' }}>${ganancia.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
              <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: "red" }}>
                Total del Día: ${totalDelDia.toFixed(2)}
                <Button onClick={generarPDFVentas} className="btn-generar-pdf">
                  Generar PDF
                </Button>
              </div>
              <div style={{ color: "green" }}>Ganancia del Día: ${gananciaDelDia.toFixed(2)}</div>

            </div>
          </>
        ) : (
          <h4>
            <p>Cargando...</p>
          </h4>
        )}

      </div>



    </div>


  );
};
export default DashboardInicio;
