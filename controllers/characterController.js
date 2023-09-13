const fs = require('fs');
const { ValidationError, Op } = require('sequelize');
const { character, Movie, character_movie } = require('../models');

exports.getAllCharacters = async ({ query }, res) => {
    const { order } = query;
    let conditions = {};
    delete query.order;
    try {
        if (Object.keys(query).find(key => key == 'name')) {
            conditions = {
                name: {
                    [Op.like]: `%${query['name']}%`
                }
            };
        }
        const objCharacter = await character.findAll({
            where: {
                is_delete: false,
                ...conditions,
                ...query
            },
            order: [
                ['name', order ? order : 'ASC']
            ]
        });

        res.status(200).json(objCharacter.map(({ image, id, name, age, history, weight }) => {
            const base64Image = image ? fs.readFileSync(image).toString('base64') : '';
            return {
                id,
                name,
                age,
                history,
                weight,
                image: `data:image/jpeg;base64,${base64Image}`
            }
        }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getCharacter = async ({ params }, res) => {
    const { id } = params
    try {
        const objCharacter = await character.findAll({
            where: { id },
            include: [{
                model: Movie,
                attributes: ['title', 'id'],
                as: 'movie',
                through: {
                    where: { is_delete: false }
                }
            }]
        });
        res.status(200).json(objCharacter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createCharaceter = async ({ body, file }, res) => {
    try {
        const { movies } = body;
        delete body.movies;

        const { dataValues } = await character.create({
            image: `./uploads/${file.originalname}`,
            ...body
        });

        if (!movies.split(',')) {
            return res.status(400).send({
                message: 'No se han seleccionado peliculas',
                error,
                process: false
            });
        }

        movies.split(',').forEach(async (movie) => {
            await character_movie.create({
                character_id: dataValues.id,
                movie_id: movie
            }).catch(error => {
                return res.status(404).send({
                    message: 'Hubo un error al crear el nuevo registro',
                    error,
                    process: false
                });
            });
        });

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
        const { movies } = body;

        const objCharacter = await character.findByPk(id);
        if (!objCharacter) {
            return res.status(404).send({ message: 'Personaje no encontrada' });
        }
        if (!movies) {
            return res.status(404).send({ message: 'No se han seleccionado peliculas' });
        }
        // delete the old chracter movies
        character_movie.update(
            { is_delete: 'true' },
            {
                where: {
                    character_id: id,
                    is_delete: 'false'
                }
            }
        )
            .catch(error => {
                return res.status(404).send({
                    message: 'Hubo un error al actulizar',
                    error,
                    process: false
                });
            });

        movies.forEach(async (movie) => {
            await character_movie.create({
                character_id: id,
                movie_id: movie
            }).catch(error => {
                return res.status(404).send({
                    message: 'Hubo un al crear el nuevo registro',
                    error,
                    process: false
                });
            });
        });

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