const Distribuidores = require('../models/distribuidor.model');

/**
 * Obtiene todos los distribuidores.
 * 
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que envía los datos.
 * @returns {Object} Lista de distribuidores en formato JSON.
 */
exports.getDistribuidores = async (req, res) => {
    try {
        const results = await Distribuidores.getAll();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Crea un nuevo distribuidor.
 * 
 * @param {Object} req - Objeto de solicitud HTTP que contiene los datos del nuevo distribuidor.
 * @param {Object} res - Objeto de respuesta HTTP con el mensaje de éxito.
 * @returns {Object} Mensaje de éxito con los detalles del distribuidor creado.
 */
exports.createDistribuidores = async (req, res) => {
    try {
        const results = await Distribuidores.create(req.body);
        res.json({ message: "Distribuidor creado", nombre_distribuidor: req.body.nombre_distribuidor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Actualiza un distribuidor existente.
 * 
 * @param {Object} req - Objeto de solicitud HTTP con el ID del distribuidor y los nuevos datos.
 * @param {Object} res - Objeto de respuesta HTTP con el mensaje de éxito.
 * @returns {Object} Mensaje de éxito o error si no se encuentra el distribuidor.
 */
exports.updateDistribuidores = async (req, res) => {
    try {
        await Distribuidores.update(req.params.id, req.body);
        res.json({ message: "Distribuidor actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteDistribuidores = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = await Distribuidores.delete(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Distribuidor no encontrado' });
        }

        res.json({ message: 'Distribuidor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar distribuidor:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getMarcasPorDistribuidor = async (req, res) => {
    const nombreDistribuidor = req.params.nombre;

    try {
        const marcas = await Distribuidores.getMarcasByDistribuidor(nombreDistribuidor);

        if (marcas.length === 0) {
            return res.status(404).json({ message: 'Este distribuidor no tiene marcas asociadas' });
        }

        res.json(marcas);
    } catch (error) {
        console.error('Error al obtener marcas por distribuidor:', error);
        res.status(500).send('Error al obtener marcas por distribuidor');
    }
};
