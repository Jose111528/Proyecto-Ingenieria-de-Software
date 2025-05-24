import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Productos.module.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Plus, Save } from "lucide-react";


import {
  FaHashtag,
  FaTag,
  FaAlignLeft,
  FaDollarSign,
  FaHandHoldingUsd,
  FaBarcode,
  FaQrcode,
  FaIndustry,
  FaTruck,
  FaBoxes,
  FaCogs,
  FaBox,
} from "react-icons/fa";

const API_URL = "http://localhost:3000/api/productos";
const API_MARCAS_URL = "http://localhost:3000/api/marcas";
const API_DISTRIBUIDORES_URL = "http://localhost:3000/api/distribuidores";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [marcasFiltradas, setMarcasFiltradas] = useState([]);
  const [distribuidores, setDistribuidores] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion: "",
    precio_compra: "",
    precio_venta: "",
    codigo_barras: "",
    codigo_producto: "",
    marca: "",
    distribuidores: "",
    stock: "",
    stock_minimo: "",
    id_distribuidor_marca: "",
  });

  useEffect(() => {
    fetchProductos();
    fetchDistribuidores();
  }, []);

  useEffect(() => {
    const cargarDatosProducto = async () => {
      if (productoEditando) {
        await fetchMarcasByDistribuidor(productoEditando.nombre_distribuidor);

        setNuevoProducto({
          ...productoEditando,
          distribuidores: productoEditando.nombre_distribuidor,
          id_distribuidor_marca: Number(productoEditando.id_distribuidor_marca)
        });
      }
    };

    cargarDatosProducto();
  }, [productoEditando]);



  const fetchProductos = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductos(response.data);
      setProductosFiltrados(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar productos',
        text: 'Intenta nuevamente más tarde.'
      });
    }
  };

  const fetchDistribuidores = async () => {
    try {
      const response = await axios.get(API_DISTRIBUIDORES_URL);
      setDistribuidores(response.data);
    } catch (error) {
      console.error("Error al obtener distribuidores:", error);
    }
  };

  const fetchMarcasByDistribuidor = async (distribuidorNombre, marcaIdSeleccionada = null) => {
    if (!distribuidorNombre) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/distribuidores/${distribuidorNombre}/marcas`
      );
      setMarcasFiltradas(response.data);

      // Si pasamos marcaIdSeleccionada, seteamos después de que las marcas se cargaron
      if (marcaIdSeleccionada !== null) {
        setNuevoProducto((prev) => ({
          ...prev,
          id_distribuidor_marca: Number(marcaIdSeleccionada),
        }));
      }
    } catch (error) {
      console.error("Error al obtener marcas por distribuidor:", error);
      setMarcasFiltradas([]);
    }
  };



  const handleEdit = (producto) => {
    setProductoEditando(producto);
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProductos();
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado correctamente.'
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'No se pudo eliminar el producto. Intenta de nuevo.'
      });
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    setNuevoProducto((prev) => ({
      ...prev,
      [name]: name === "id_distribuidor_marca" ? Number(value) : value,
    }));

    if (name === "distribuidores") {
      fetchMarcasByDistribuidor(value);
    }

    if (["nombre_producto", "descripcion", "codigo_barras", "codigo_producto"].includes(name)) {
      filtrarProductos(name, value);
    }
  };



  const filtrarProductos = (campo, valor) => {
    const filtrados = productos.filter((producto) => {
      const campoValor = producto[campo];
      return String(campoValor).toLowerCase().includes(valor.toLowerCase());
    });
    setProductosFiltrados(filtrados);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!nuevoProducto.nombre_producto || !nuevoProducto.precio_compra || !nuevoProducto.precio_venta) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios faltantes',
        text: 'Por favor completa nombre, precio de compra y precio de venta.'
      });
    }

    const codigoBarrasDuplicado = productos.some(
      (p) => p.codigo_barras === nuevoProducto.codigo_barras &&
        (!productoEditando || p.id_producto !== productoEditando.id_producto)
    );
    if (codigoBarrasDuplicado) {
      return Swal.fire({
        icon: 'error',
        title: 'Código de barras duplicado',
        text: 'El código de barras ya está registrado. Por favor, ingrese uno diferente.'
      });
    }


    try {

      if (productoEditando) {
        await handleUpdateProducto();
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: 'Se actualizó correctamente.'
        });
      } else {
        // Si estamos agregando un nuevo producto
        const response = await axios.post(API_URL, nuevoProducto);

        // Si el backend devuelve un error indicando código de barras duplicado
        if (response.data.error === "El código de barras ya está registrado") {
          Swal.fire({
            icon: 'error',
            title: 'Código de barras duplicado',
            text: 'El código de barras ya está registrado. Por favor, ingrese uno diferente.'
          });
        } else {
          // Si el producto se guarda correctamente
          Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'El producto fue agregado correctamente.'
          });
        }
      }

      // Limpiar el formulario después de guardar
      setNuevoProducto({
        nombre_producto: "",
        descripcion: "",
        precio_compra: "",
        precio_venta: "",
        codigo_barras: "",
        codigo_producto: "",
        marca: "",
        distribuidores: "",
        stock: "",
        stock_minimo: "",
        id_distribuidor_marca: "",
      });

      setProductoEditando(null);
      fetchProductos(); // Recargar la lista de productos
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'Ocurrió un problema al guardar el producto. Intenta de nuevo.'
      });
    }
  };

  /**
 * Sends an update request to the backend for the selected product.
 */

  const handleUpdateProducto = async () => {
    await axios.put(`${API_URL}/${productoEditando.id_producto}`, nuevoProducto);
  };


  return (
    <div className={styles["productos-container"]}>
      <a href="https://www.truper.com/CatVigente/" target="_blank">
        <button>Ir a truper</button>
      </a>

      <h2><FaBox style={{ marginRight: "5px" }}></FaBox>Gestión de Productos</h2>
      <form onSubmit={handleSubmit} className={styles["form-productos"]}>
        <div className={styles["form-grid"]}>
          <Input type="text" name="codigo_barras" value={nuevoProducto.codigo_barras} onChange={handleChange} label="Código de Barras" />
          <Input type="text" name="nombre_producto" value={nuevoProducto.nombre_producto} onChange={handleChange} label="Nombre del Producto" />
          <Input type="text" name="descripcion" value={nuevoProducto.descripcion} onChange={handleChange} label="Descripción" />
          <Input type="text" name="codigo_producto" value={nuevoProducto.codigo_producto} onChange={handleChange} label="Código de Producto" />
          <Input type="number" name="precio_compra" value={nuevoProducto.precio_compra} onChange={handleChange} label="Precio de Compra" />
          <Input type="number" name="precio_venta" value={nuevoProducto.precio_venta} onChange={handleChange} label="Precio de Venta" />
          <Input type="number" name="stock" value={nuevoProducto.stock} onChange={handleChange} label="Stock" />
          <Input type="number" name="stock_minimo" value={nuevoProducto.stock_minimo} onChange={handleChange} label="Stock Minimo" />

          <select name="distribuidores" value={nuevoProducto.distribuidores} onChange={handleChange}>
            <option value="">Seleccione un distribuidor</option>
            {distribuidores.map((dist) => (
              <option key={dist.id_distribuidores} value={dist.nombre_distribuidor}>
                {dist.nombre_distribuidor}
              </option>
            ))}
          </select>

          <select name="id_distribuidor_marca" value={nuevoProducto.id_distribuidor_marca} onChange={handleChange}>
            <option value="">Seleccione una marca</option>
            {marcasFiltradas.map((marca) => (
              <option key={marca.id_distribuidor_marca} value={marca.id_distribuidor_marca} onChange={handleChange}>
                {marca.nombre_marca}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            icon={productoEditando ? Save : Plus}
            className={styles["boton-agregar"]}
          >
            {productoEditando ? "Actualizar Producto" : "Agregar Producto"}
          </Button>


        </div>

      </form>
      <div className={styles["tabla-container"]}>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th><FaHashtag style={{ marginRight: "5px" }} /> ID</th>
              <th><FaTag style={{ marginRight: "5px" }} /> Nombre</th>
              <th><FaAlignLeft style={{ marginRight: "5px" }} /> Descripción</th>
              <th><FaDollarSign style={{ marginRight: "5px" }} /> Precio Compra</th>
              <th><FaHandHoldingUsd style={{ marginRight: "5px" }} /> Precio Venta</th>
              <th><FaBarcode style={{ marginRight: "5px" }} /> Código de Barras</th>
              <th><FaQrcode style={{ marginRight: "5px" }} /> Código de Producto</th>
              <th><FaIndustry style={{ marginRight: "5px" }} /> Marca</th>
              <th><FaTruck style={{ marginRight: "5px" }} /> Distribuidor</th>
              <th><FaBoxes style={{ marginRight: "5px" }} /> Stock</th>
              <th><FaBoxes style={{ marginRight: "5px" }} /> Stock Minimok</th>
              <th><FaCogs style={{ marginRight: "5px" }} /> Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio_compra}</td>
                <td>{producto.precio_venta}</td>
                <td>{producto.codigo_barras}</td>
                <td>{producto.codigo_producto}</td>
                <td>{producto.nombre_marca}</td>
                <td>{producto.nombre_distribuidor}</td>
                <td>{producto.stock}</td>
                <td>{producto.stock_minimo}</td>
                <td>
                  <Button onClick={() => handleEdit(producto)}>Editar</Button>
                  <Button onClick={() => handleDelete(producto.id_producto)}>Eliminar</Button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;
