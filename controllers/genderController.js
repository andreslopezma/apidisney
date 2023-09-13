const { Gender } = require('../models');

exports.getAllGenders = async (req, res) => {
    try {
        const gender = await Gender.findAll();
        res.status(200).json(gender);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}