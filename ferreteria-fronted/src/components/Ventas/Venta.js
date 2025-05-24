import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Venta.module.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { jwtDecode } from "jwt-decode";

import { FaTrash, FaShoppingCart, FaPlus, FaCheck, FaTimes, FaBox, FaDollarSign, FaWarehouse, FaReceipt } from "react-icons/fa";
import { MdShoppingBasket } from "react-icons/md";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/api/productos";
const VENTA_API = "http://localhost:3000/api/ventas";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === "") {
      setProductosFiltrados([]);
    } else {
      filtrarProductos(busqueda);
    }
  }, [busqueda, productos]);

  // Fetches the list of products from the API and updates the state.
  // If the request fails, an error message is displayed.

  const fetchProductos = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductos(response.data);
      setProductosFiltrados(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("Error al obtener productos");
    }
  };




  const handleSeleccionarProducto = (producto) => {
    if (producto.stock === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin stock',
        text: 'Este producto no tiene stock disponible.',
      });
    } else {
      seleccionarProducto(producto);
    }
  };


  // Filters the products based on the search query (either by product name, barcode, or product code).
  const filtrarProductos = (valor) => {
    const filtrados = productos.filter((producto) =>
      String(producto.nombre_producto).toLowerCase().includes(valor.toLowerCase()) ||
      String(producto.codigo_barras).toLowerCase().includes(valor.toLowerCase()) ||
      String(producto.codigo_producto).toLowerCase().includes(valor.toLowerCase())
    );
    setProductosFiltrados(filtrados);
  };

  // Handles changes to the search input field.
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  // Handles the "Enter" key press event to auto-select a product if only one filtered result is present.
  const manejarEnter = (e) => {
    if (e.key === "Enter" && productosFiltrados.length === 1) {
      seleccionarProducto(productosFiltrados[0]);
    }
  };


  // Selects a product for adding to the cart, checks for availability in stock.
  const seleccionarProducto = (producto) => {
    if (producto.stock === 0) {
      setError("Este producto no tiene stock disponible.");
      return;
    }
    setProductoSeleccionado(producto);
    setCantidad(1);
    setBusqueda("");
    setError("");
  };


  // Adds the selected product and specified quantity to the cart.
  const agregarAlCarrito = () => {
    if (productoSeleccionado) {
      const stockDisponible = productoSeleccionado.stock;
      const nuevaCantidad = parseInt(cantidad);

      if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
        setError("La cantidad debe ser al menos 1");
        return;
      }

      if (nuevaCantidad > stockDisponible) {
        setError("No hay suficiente stock para este producto");
        return;
      }

      const indexEnCarrito = carrito.findIndex(p => p.id_producto === productoSeleccionado.id_producto);

      let nuevoCarrito;
      if (indexEnCarrito !== -1) {
        nuevoCarrito = [...carrito];
        nuevoCarrito[indexEnCarrito].cantidad += nuevaCantidad;
      } else {
        nuevoCarrito = [...carrito, { ...productoSeleccionado, cantidad: nuevaCantidad }];
      }

      const nuevosProductos = productos.map(p =>
        p.id_producto === productoSeleccionado.id_producto
          ? { ...p, stock: p.stock - nuevaCantidad }
          : p
      );

      setProductos(nuevosProductos);
      setCarrito(nuevoCarrito);
      setTotal(total + productoSeleccionado.precio_venta * nuevaCantidad);
      setProductoSeleccionado(null);
      setCantidad(1);
      setError("");
    }
  };


  const eliminarDelCarrito = (id_producto) => {
    const producto = carrito.find(p => p.id_producto === id_producto);
    if (!producto) return;

    Swal.fire({
      title: '¿Cuántas unidades deseas eliminar?',
      input: 'number',
      inputAttributes: {
        min: 1,
        max: producto.cantidad,
        step: 1
      },
      inputValue: producto.cantidad,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: (valor) => {
        const cantidadAEliminar = parseInt(valor);
        if (isNaN(cantidadAEliminar) || cantidadAEliminar <= 0) {
          Swal.showValidationMessage("Cantidad inválida");
        } else if (cantidadAEliminar > producto.cantidad) {
          Swal.showValidationMessage("No puedes eliminar más de lo que hay en el carrito");
        }
        return cantidadAEliminar;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidadAEliminar = result.value;

        let nuevoCarrito;
        if (cantidadAEliminar === producto.cantidad) {
          // Eliminar completamente el producto
          nuevoCarrito = carrito.filter(p => p.id_producto !== id_producto);
        } else {
          // Solo restar parte de la cantidad
          nuevoCarrito = carrito.map(p =>
            p.id_producto === id_producto
              ? { ...p, cantidad: p.cantidad - cantidadAEliminar }
              : p
          );
        }

        // Devolver cantidad al stock
        const nuevosProductos = productos.map(p =>
          p.id_producto === id_producto
            ? { ...p, stock: p.stock + cantidadAEliminar }
            : p
        );

        setProductos(nuevosProductos);
        setCarrito(nuevoCarrito);
        setTotal(total - producto.precio_venta * cantidadAEliminar);
      }
    });
  };


  // Finalizes the purchase by sending the cart data to the API, processes the sale.
  const finalizarCompra = () => {
    if (carrito.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos antes de finalizar la compra.", "info");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire("Error", "No estás autenticado", "error");
      return;
    }

    const decodeToken = jwtDecode(token);
    const userId = decodeToken.userId;

    const ventaData = {
      id_usuario: userId,
      id_cliente: null,
      productos: carrito.map(producto => ({
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
        precio_venta: producto.precio_venta,
        subtotal: producto.precio_venta * producto.cantidad
      }))
    };

    axios.post(VENTA_API, ventaData)
      .then(() => {
        Swal.fire({
          title: "Monto recibido",
          input: "number",
          inputLabel: `Total: $${total.toFixed(2)}\nIngresa el monto que pagó el cliente`,
          inputAttributes: {
            min: total,
            step: "0.01"
          },
          inputValidator: (value) => {
            if (!value || parseFloat(value) < total) {
              return "El monto recibido debe ser igual o mayor al total.";
            }
          },
          showCancelButton: true,
          confirmButtonText: "Continuar"
        }).then((result) => {
          if (result.isConfirmed) {
            const montoPagado = parseFloat(result.value);
            const cambio = montoPagado - total;

            // Mostrar confirmación e imprimir ticket

            imprimirTicket(montoPagado, cambio); 

            Swal.fire("¡Compra realizada con éxito!", "", "success");
            // Limpiar datos
            setCarrito([]);
            setTotal(0);
            setProductoSeleccionado(null);
            setCantidad(1);
            fetchProductos();

          }
        });
      })
      .catch(error => {
        console.error("Error al procesar la venta:", error.response ? error.response.data : error.message);
        Swal.fire("Error", error.response?.data?.error || "Ocurrió un error desconocido", "error");
      });
  };

  const imprimirTicket = (montoPagado, cambio) => {

    const ticketContent = document.getElementById('ticket').innerHTML;
    const ventanaImpresion = window.open('', 'PRINT', 'height=400,width=600');
    ventanaImpresion.document.write('<html><head><title>Ticket</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write('@media print { .ticket { width: 58mm; font-family: monospace; font-size: 12px; margin: 0; padding: 10px; } }');
    ventanaImpresion.document.write('</style>');
    ventanaImpresion.document.write('</head><body>');
    ventanaImpresion.document.write('<div class="ticket">');
    ventanaImpresion.document.write(ticketContent);

    //  Mostrar pago y cambio al final del ticket
    ventanaImpresion.document.write(`<p>Total pagado: $${montoPagado.toFixed(2)}</p>`);
    ventanaImpresion.document.write(`<p>Cambio: $${cambio.toFixed(2)}</p>`);

    ventanaImpresion.document.write('</div>');
    ventanaImpresion.document.write('</body></html>');

    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
  };


  // Formats the product name to split long names into two lines for better presentation on the ticket.
  const nombreProductoFormateado = (nombre) => {
    const maxLength = 10; // Ajusta este valor según lo que consideres que sea el tamaño adecuado
    if (nombre.length > maxLength) {
      return nombre.slice(0, maxLength) + "\n" + nombre.slice(maxLength);
    }
    return nombre;
  };

  return (



    <div className={styles["ventas-layout"]}>
      {/* Contenedor Izquierdo */}
      <div className={styles["ventas-productos"]}>
        <h3>Productos Disponibles</h3>

        {/* Input para la búsqueda de productos */}
        <Input
          className={styles["input1"]}
          type="text"
          value={busqueda}
          onChange={handleBusquedaChange}
          onKeyPress={manejarEnter}
          label="Buscar Producto"
          placeholder="Escribe para buscar..."
        />

        {/* Tabla de Productos Disponibles */}
        <div className={styles["tabla-container1"]}>
          <table className="tabla-productos1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Código de Barras</th>
                <th>Código de Producto</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay productos que coincidan con la búsqueda.</td>
                </tr>
              ) : (
                productosFiltrados.map(producto => (

                  <tr key={producto.id_producto}>
                    <td>{producto.id_producto}</td>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.codigo_barras}</td>
                    <td>{producto.codigo_producto}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <Button onClick={() => handleSeleccionarProducto(producto)}>
                        <FaCheck /> Seleccionar
                      </Button>

                    </td>
                  </tr>

                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Producto Seleccionado */}
        {productoSeleccionado && (
          <div className={styles["producto-seleccionado"]}>
            <h3>Producto Seleccionado</h3>
            <div className={styles["producto-card"]}>
              <div className={styles["info-line"]}>
                <FaBox className={styles["icono"]} />
                <p className={styles["info-text"]}>Nombre: {productoSeleccionado.nombre_producto}</p>
              </div>
              <div className={styles["info-line"]}>
                <FaDollarSign className={styles["icono"]} />
                <p className={styles["info-text"]}>Precio: ${productoSeleccionado.precio_venta}</p>
              </div>
              <div className={styles["info-line"]}>
                <FaWarehouse className={styles["icono"]} />
                <p className={styles["info-text"]}>Stock: {productoSeleccionado.stock}</p>
              </div>
            </div>

            {/* Input para cantidad de producto */}
            <Input
              className={styles["input2"]}
              type="number"
              label="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              max={productoSeleccionado.stock}
            />

            {/* Botón para agregar al carrito */}
            <Button icon={FaPlus} onClick={agregarAlCarrito}>
              Agregar al Carrito
            </Button>

            {/* Error de cantidad */}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
      </div>

      {/* Contenedor Derecho */}
      <div className={styles["ventas-carrito"]}>
        <h3 className={styles["carrito-titulo"]}>
          <FaShoppingCart className={styles["icono"]} /> Carrito de Compras
        </h3>

        {/* Resumen del carrito */}
        <div className={styles["ticket"]}>
          {carrito.map((producto) => (
            <div key={producto.id_producto} className={styles["ticket-item"]}>
              <p className={styles["producto-nombre"]}>{producto.nombre_producto}</p>
              <p className={styles["producto-detalle"]}>Cantidad: {producto.cantidad}</p>
              <p className={styles["producto-detalle"]}>Subtotal: ${(producto.precio_venta * producto.cantidad).toFixed(2)}</p>
            </div>
          ))}

          <div className={styles["ticket-total"]}>
            <FaDollarSign className={styles["icono-total"]} />
            <span>Total: ${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className={styles["botones-ticket"]}>
          <Button onClick={finalizarCompra}>Finalizar Compra</Button>

        </div>

        {/* Tabla de productos en el carrito */}
        <h3>Productos en Carrito:</h3>
        <table className={styles["tabla1"]}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre_producto}</td>
                <td>{producto.cantidad}</td>
                <td>${(producto.precio_venta * producto.cantidad).toFixed(2)}</td>
                <td>
                  <Button onClick={() => eliminarDelCarrito(producto.id_producto)}>
                    <FaTrash /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "none" }}>
        <div id="ticket" className="ticket">
          <h2 style={{ textAlign: "center", fontSize: "14px" }}>FERRETERIA JOSCIAN</h2>
          <p style={{ textAlign: "center", fontSize: "12px" }}>Prolongacion 5 de Mayo Calle Camino Antiguo a San Aparicio</p>
          <p style={{ textAlign: "center", fontSize: "12px" }}>Fecha: {new Date().toLocaleDateString()}</p>
          <hr />
          <table style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Producto</th>
                <th style={{ width: '20%' }}>Cantidad</th>
                <th style={{ width: '20%' }}>Subtotal</th>
                <p>Total: $<span id="total-ticket">${total.toFixed(2)}</span></p>
              </tr>
            </thead>
            <tbody>
              {carrito.map((producto) => (
                <tr key={producto.id_producto}>
                  <td style={{ fontSize: '12px' }}>{nombreProductoFormateado(producto.nombre_producto)}</td>

                  <td style={{ fontSize: '12px' }}>{producto.cantidad}</td>
                  <td style={{ fontSize: '12px' }}>${(producto.precio_venta * producto.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <p style={{ textAlign: "right", fontSize: "14px", fontWeight: "bold" }}>TOTAL: ${total.toFixed(2)}</p>
          <hr />
          <p style={{ textAlign: "center", fontSize: "12px" }}>¡Gracias por su compra!</p>
        </div>
      </div>


    </div>


  );
};

export default Ventas;