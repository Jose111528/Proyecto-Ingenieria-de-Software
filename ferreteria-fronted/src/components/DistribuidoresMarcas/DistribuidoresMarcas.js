import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./NuevosElementos.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import {
  FaStore, FaTag, FaPlusCircle, FaLink, AiFillDelete
} from "react-icons/fa";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const API_DISTRIBUIDORES_URL = "http://localhost:3000/api/distribuidores";
const API_MARCAS_URL = "http://localhost:3000/api/marcas";
const API_RELACION_URL = "http://localhost:3000/api/distribuidoresMarcas";
const API_DIST_MARCA_URL = "http://localhost:3000/api/distribuidoresMarcas/obtener";

const NuevosElementos = () => {
  const [distribuidores, setDistribuidores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [nuevoDistribuidor, setNuevoDistribuidor] = useState("");
  const [telefonoDistribuidor, setTelefonoDistribuidor] = useState("");
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [distribuidorSeleccionado, setDistribuidorSeleccionado] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [distribuidoresMarcas, setDistribuidoresMarcas] = useState([]);


  useEffect(() => {
    fetchDistribuidores();
    fetchMarcas();
    obtenerDM();
  }, []);

  const fetchDistribuidores = async () => {
    try {
      const response = await axios.get(API_DISTRIBUIDORES_URL);
      setDistribuidores(response.data);
    } catch (error) {
      console.error("Error al obtener distribuidores:", error);
    }
  };

  const fetchMarcas = async () => {
    try {
      const response = await axios.get(API_MARCAS_URL);
      setMarcas(response.data);
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  };

  const agregarDistribuidor = async () => {
    if (!nuevoDistribuidor.trim() || !telefonoDistribuidor.trim()) {
      return Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ingrese un nombre y teléfono válidos",
      });
    }

    // Validación: Verificar si el distribuidor ya existe
    const yaExiste = distribuidores.some(
      (dist) => dist.nombre_distribuidor.toLowerCase().trim() === nuevoDistribuidor.toLowerCase().trim()
    );

    if (yaExiste) {
      return Swal.fire({
        icon: "warning",
        title: "¡Advertencia!",
        text: "El distribuidor ya existe",
      });
    }

    try {
      await axios.post(API_DISTRIBUIDORES_URL, {
        nombre_distribuidor: nuevoDistribuidor.trim(),
        telefono: telefonoDistribuidor.trim(),
      });
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Distribuidor agregado",
      });
      setNuevoDistribuidor("");
      setTelefonoDistribuidor("");
      fetchDistribuidores();
    } catch (error) {
      console.error("Error al agregar distribuidor:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al agregar el distribuidor",
      });
    }
  };
  const agregarMarca = async () => {
    if (!nuevaMarca.trim()) {
      return Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ingrese un nombre válido",
      });
    }

    // Validación: Verificar si la marca ya existe
    const yaExiste = marcas.some(
      (marca) => marca.nombre_marca.toLowerCase().trim() === nuevaMarca.toLowerCase().trim()
    );

    if (yaExiste) {
      return Swal.fire({
        icon: "warning",
        title: "¡Advertencia!",
        text: "La marca ya existe",
      });
    }

    try {
      await axios.post(API_MARCAS_URL, {
        nombre_marca: nuevaMarca.trim(),
      });
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Marca agregada",
      });
      setNuevaMarca("");
      fetchMarcas();
    } catch (error) {
      console.error("Error al agregar marca:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al agregar la marca",
      });
    }
  };


  const verificarAsociacion = async (idDistribuidor, idMarca) => {
    try {
      const response = await axios.get(`${API_RELACION_URL}/verificar`, {
        params: {
          id_distribuidor: idDistribuidor,
          id_marca: idMarca,
        },
      });
      return response.data.existe;
    } catch (error) {
      console.error("Error al verificar asociación:", error);
      return false;
    }
  };

  const asociarDistribuidorMarca = async () => {
    if (!distribuidorSeleccionado || !marcaSeleccionada) {
      return Swal.fire({
        icon: "warning",
        title: "¡Advertencia!",
        text: "Selecciona un distribuidor y una marca",
      });
    }

    const yaEstanAsociados = await verificarAsociacion(distribuidorSeleccionado, marcaSeleccionada);

    if (yaEstanAsociados) {
      setMensaje("El distribuidor y la marca ya están asociados.");
      return;
    }

    try {
      const response = await axios.post(`${API_RELACION_URL}/asociar`, {
        id_distribuidor: distribuidorSeleccionado,
        id_marca: marcaSeleccionada,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "¡Exito!",
          text: "Distribuidor y Marca asociados correctamente",
        });
        setMensaje("");
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Hubo un problema al asociar",
        });
      }
    } catch (error) {
      console.error("Error al asociar distribuidor con marca:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Error en la asociación",
      });
    }
  };

  const eliminarDistribuidor = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_DISTRIBUIDORES_URL}/${id}`);
      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Distribuidor eliminado",
      });
      fetchDistribuidores();
    } catch (error) {
      console.error("Error al eliminar distribuidor:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al eliminar el distribuidor",
      });
    }
  };

  const eliminarMarca = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_MARCAS_URL}/${id}`);
      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Marca eliminada",
      });
      fetchMarcas();
    } catch (error) {
      console.error("Error al eliminar marca:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al eliminar la marca",
      });
    }
  };

  const obtenerDM = async () => {
    try {
      const response = await axios.get(API_DIST_MARCA_URL);
      setDistribuidoresMarcas(response.data);
    } catch (error) {
      console.error("Error al obtener las asociaciones de Distribuidores y Marcas:", error);
    }
  };

  const borrarDM = async (idDistribuidor, idMarca) => {
    try {
      // Verifica si hay productos asociados
      const check = await axios.get(`${API_RELACION_URL}/tieneProductos`, {
        params: {
          id_distribuidor: idDistribuidor,
          id_marca: idMarca,
        },
      });

      if (check.data.tieneProductos) {
        return Swal.fire({
          icon: "warning",
          title: "¡No se puede eliminar!",
          text: "La asociación tiene productos asociados. Elimínalos primero.",
        });
      }

      // Confirmar eliminación si no tiene productos
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;

      // Eliminar la asociación
      const response = await axios.delete(`${API_RELACION_URL}/borrar`, {
        params: {
          id_distribuidor: idDistribuidor,
          id_marca: idMarca,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Asociación eliminada correctamente",
        });
        obtenerDM(); // Refrescar lista
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "No se encontró la asociación para eliminar",
        });
      }
    } catch (error) {
      console.error("Error al verificar/eliminar la asociación:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al eliminar la asociación , producto asociado",
      });
    }
  };


  return (
    <div class="grid-nuevos">
      <div class="cuadro cuadro1">
        <h3 className={styles["titulo"]}>Distribuidores</h3>
        <ul className={styles["listaDistribudores"]}>
          {distribuidores.map((dist) => (
            <li key={dist.id_distribuidor} className={styles["itemDistribuidor"]}>
              <div>
                <strong>{dist.nombre_distribuidor}</strong><br />
                <small>{dist.telefono}</small>
              </div>
              <button
                className={styles["eliminar-btn"]}
                onClick={() => eliminarDistribuidor(dist.id_distribuidor)}
              >
                ❌ Eliminar
              </button>
            </li>
          ))}
        </ul>

      </div>
      <div className="cuadro cuadro2">
        <h3 className={styles["titulo"]}>Marcas</h3>

        <div className={styles["fila"]}>
          <ul className={styles["lista"]}>
            {marcas.map((marca) => (
              <li key={marca.id_marca} className={styles["item"]}>
                <div>
                  <strong>{marca.nombre_marca}</strong>
                </div>
                <button
                  className={styles["eliminar-btn"]}
                  onClick={() => eliminarMarca(marca.id_marca)}
                >
                  ❌ Eliminar
                </button>
              </li>
            ))}
          </ul>

        </div>
      </div>


      <div className="cuadro cuadro3">

        <h3><FaLink style={{ marginRight: "5px" }}></FaLink> Asociaciones de Distribuidores y Marcas</h3>
        <ul className={styles["lista"]}>
          {distribuidoresMarcas.map((asociacion) => (
            <li key={asociacion.id_distribuidor_marca} className={styles["item"]}>
              {console.log(asociacion)}
              <div>
                <strong>{asociacion.nombre_distribuidor}</strong> - <strong>{asociacion.nombre_marca}</strong>
              </div>
              <button
                className={styles["eliminar-btn"]}
                onClick={() => borrarDM(asociacion.id_distribuidor, asociacion.id_marca)}
              >
                ❌ Eliminar
              </button>
            </li>
          ))}

        </ul>
      </div>


      <div className="cuadro cuadro4">
        <h3><FaTag style={{ marginRight: "5px" }}></FaTag> Agregar Marca</h3>
        <div className={styles["fila"]}>
          <Input
            type="text"
            placeholder="Nueva Marca"
            value={nuevaMarca}
            onChange={(e) => setNuevaMarca(e.target.value)}
            label="Nueva Marca"
          />
          <Button onClick={agregarMarca} className={styles["boton-nuevo"]}><FaPlusCircle style={{ marginRight: "5px" }}></FaPlusCircle>
            Agregar Marca
          </Button>
        </div>
      </div>
      <div className="cuadro cuadro5">
        <h3><FaStore style={{ marginRight: "5px" }}></FaStore> Agregar Distribuidor</h3>
        <Input
          type="text"
          placeholder="Nuevo Distribuidor"
          value={nuevoDistribuidor}
          onChange={(e) => setNuevoDistribuidor(e.target.value)}
          label="Nuevo Distribuidor"
        />
        <Input
          type="text"
          placeholder="Teléfono"
          value={telefonoDistribuidor}
          onChange={(e) => setTelefonoDistribuidor(e.target.value)}
          label="Teléfono"
        />
        <Button onClick={agregarDistribuidor} className={styles["boton-nuevo"]}>
          <FaPlusCircle style={{ marginRight: "5px" }}></FaPlusCircle> Agregar Distribuidor
        </Button>
      </div>

      <div className="cuadro cuadro6">
        <h3><FaLink style={{ marginRight: "5px" }}></FaLink>Asociar Marca a Distribuidor</h3>

        <div className={styles["fila"]}>
          <select className={styles["select1"]} onChange={(e) => setDistribuidorSeleccionado(e.target.value)}>

            <option value="">Seleccione un distribuidor</option>
            {distribuidores.map((dist) => (
              <option key={dist.id_distribuidor} value={dist.id_distribuidor}>
                {dist.nombre_distribuidor}
              </option>
            ))}
          </select>
          <select className={styles["select2"]} onChange={(e) => setMarcaSeleccionada(e.target.value)}>
            <option value="">Seleccione una marca</option>
            {marcas.map((marca) => (
              <option key={marca.id_marca} value={marca.id_marca}>
                {marca.nombre_marca}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={asociarDistribuidorMarca} className={styles["boton-asociar"]}>
          Asociar
        </Button>
        {mensaje && <p>{mensaje}</p>}


      </div>






    </div>
  );

};


export default NuevosElementos;
