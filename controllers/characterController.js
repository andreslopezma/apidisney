const { ValidationError, Op } = require('sequelize');
const { character } = require('../models');

exports.getAllCharacters = async ({ query }, res) => {
    const { order } = query;
    let conditions = {};
    delete query.order;
    try {
        if (Object.keys(query).find(key => key == 'name')) {
            conditions = {
                ...query,
                name: {
                    [Op.like]: `%${query['name']}%`
                }
            };
        }
        const objCharacter = await character.findAll({
            where: {
                is_delete: false,
                ...conditions
            },
            order: [
                ['name', order]
            ]
        });
        res.status(200).json(objCharacter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createCharaceter = async ({ body }, res) => {
    try {
        const { dataValues } = await character.create(body);
        res.status(200).json({
            message: 'Se creo el personaje con exito',
            id: dataValues.id,
            process: true
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error, process: false });
        } else {
            res.status(500).json({ error: error.message, process: false });
        }
    }
}


exports.updateCharacter = async ({ body, params }, res) => {
    try {
        const { id } = params;

        const objCharacter = await character.findByPk(id);
        if (!objCharacter) {
            return res.status(404).send({ message: 'Personaje no encontrada' });
        }

        const updatedCharacter = await objCharacter.update(body);
        return res.status(200).send({
            message: 'Se actualizo el registro con exito',
            process: true,
            updatedCharacter
        });

    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error, process: false });
        } else {
            res.status(500).json({ error: error.message, process: false });
        }
    }
}

exports.deleteCharacter = async ({ params }, res) => {
    try {
        const { id } = params;

        const objCharacter = await character.findByPk(id);
        if (!objCharacter) {
            return res.status(404).send({ message: 'Personaje no encontrada' });
        }

        const updatedCharacter = await objCharacter.update({ is_delete: 'true' });
        return res.status(200).send({
            message: 'Se elimino el registro con exito',
            process: true,
            updatedCharacter
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error, process: false });
        } else {
            res.status(500).json({ error: error.message, process: false });
        }
    }
}