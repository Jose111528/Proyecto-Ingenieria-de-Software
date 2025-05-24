const DistribuidoresMarcas = require("../models/distribuidoresMarcas.model");

/**
 * Verifica si existe la asociación entre un distribuidor y una marca.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros `id_distribuidor` y `id_marca`.
 * @param {Object} res - El objeto de respuesta para enviar los resultados.
 * @returns {Object} Respuesta con un objeto JSON indicando si la asociación existe o no.
 */
const verificarAsociacion = async (req, res) => {
  const { id_distribuidor, id_marca } = req.query;

  if (!id_distribuidor || !id_marca) {
    return res.status(400).json({ error: "Faltan parámetros id_distribuidor o id_marca" });
  }

  try {     
    const asociacion = await DistribuidoresMarcas.verificarAsociacion(id_distribuidor, id_marca);
    return res.json({ existe: !!asociacion });
  } catch (error) {
    console.error("Error al verificar la asociación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Asocia un distribuidor con una marca si no existe una asociación previa.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros `id_distribuidor` y `id_marca` en el cuerpo de la solicitud.
 * @param {Object} res - El objeto de respuesta para enviar el resultado de la asociación.
 * @returns {Object} Respuesta con un mensaje de éxito o error según el resultado.
 */
const asociarDistribuidorMarca = async (req, res) => {
  const { id_distribuidor, id_marca } = req.body;

  if (!id_distribuidor || !id_marca) {
    return res.status(400).json({ error: "Faltan parámetros id_distribuidor o id_marca" });
  }

  try {
    const asociacionExistente = await DistribuidoresMarcas.verificarAsociacion(id_distribuidor, id_marca);
    if (asociacionExistente) {
      return res.status(400).json({ error: "La relación ya existe entre este distribuidor y esta marca." });
    }

    const result = await DistribuidoresMarcas.insertDistribuidorMarca(id_distribuidor, id_marca);
    res.status(201).json({ mensaje: "Distribuidor y Marca asociados correctamente", id: result.insertId });
  } catch (error) {
    console.error("Error al asociar distribuidor con marca:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtiene todas las asociaciones entre distribuidores y marcas.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta que contiene la lista de asociaciones.
 * @returns {Array} Respuesta con un array de asociaciones de distribuidores y marcas.
 */
const obtenerDistribuidoresMarcas = async (req, res) => {
  try {
    const distribuidoresMarcas = await DistribuidoresMarcas.getAllDistribuidoresMarcas();
    res.json(distribuidoresMarcas);
  } catch (error) {
    console.error("Error al obtener distribuidores marcas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Elimina la asociación entre un distribuidor y una marca.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros `id_distribuidor` y `id_marca`.
 * @param {Object} res - El objeto de respuesta que indicará si la eliminación fue exitosa.
 * @returns {Object} Respuesta con un mensaje de éxito o error.
 */
const eliminarDistribuidorMarca = async (req, res) => {
  const { id_distribuidor, id_marca } = req.query;

  if (!id_distribuidor || !id_marca) {
    return res.status(400).json({ error: "Faltan parámetros id_distribuidor o id_marca" });
  }

  try {
    const asociacionExistente = await DistribuidoresMarcas.verificarAsociacion(id_distribuidor, id_marca);
    if (!asociacionExistente) {
      return res.status(404).json({ error: "No se encontró la relación entre este distribuidor y esta marca." });
    }

    const resultado = await DistribuidoresMarcas.deleteDistribuidorMarca(id_distribuidor, id_marca);
    res.status(200).json({ mensaje: "Asociación eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar la asociación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { verificarAsociacion, asociarDistribuidorMarca, obtenerDistribuidoresMarcas, eliminarDistribuidorMarca };
