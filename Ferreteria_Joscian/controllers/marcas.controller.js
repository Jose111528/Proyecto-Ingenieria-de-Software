/* This code snippet is a set of controller functions for handling CRUD operations related to a model
called `Marca`. Here's a breakdown of what each function does: */

const Marca = require('../models/marcas.model');

exports.getMarcas = async (req, res) => {
    try {
        const results = await Marca.getAll();
        res.json(results); // <- Agregá esta línea
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMarcaById = async (req, res) => {
    try {
        const results = await Marca.getById(req.params.id);
        if (results.length === 0) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMarca = async (req, res) => {
    try {
        const results = await Marca.create(req.body);
        res.json({ message: "Marca creada", nombre_marca: req.body.nombre_marca });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMarca = async (req, res) => {
    try {
        await Marca.update(req.params.id, req.body);
        res.json({ message: "Marca actualizada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMarca = async (req, res) => {
    try {
        await Marca.delete(req.params.id);
        res.json({ message: "Marca eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
