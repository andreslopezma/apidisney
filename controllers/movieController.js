const fs = require('fs');
const { ValidationError, Op } = require('sequelize');
const { Movie, Gender } = require('../models');

exports.getAllMovies = async ({ query }, res) => {
    const { order } = query;
    let conditions = {};
    delete query.order;
    try {
        if (Object.keys(query).find(key => key == 'title')) {
            conditions = {
                title: {
                    [Op.like]: `%${query['title']}%`
                }
            };
        }
        delete query.title
        const movies = await Movie.findAll({
            where: {
                is_delete: false,
                ...conditions,
                ...query
            },
            include: [{
                model: Gender,
                attributes: ['name', 'id'],
                as: 'gender'
            }],
            order: [
                ['title', order ? order : 'ASC']
            ]
        });
        res.status(200).json(movies.map(({ id, title, publication_date, qualification, image, gender }) => {
            const base64Image = image ? fs.readFileSync(image).toString('base64') : '';
            return {
                id,
                title,
                publication_date,
                qualification,
                gender,
                image: `data:image/jpeg;base64,${base64Image}`
            }
        }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllMovie = async ({ params }, res) => {
    const { id } = params
    try {
        const objCharacter = await Movie.findAll({
            where: { id },
            include: [{
                model: Gender,
                attributes: ['name', 'id'],
                as: 'gender'
            }]
        });
        res.status(200).json(objCharacter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createMovie = async ({ body, file }, res) => {
    try {
        const { dataValues } = await Movie.create({
            image: `./uploads/${file.originalname}`,
            ...body
        });
        res.status(200).json({
            message: 'Se creo la pelicula con exito',
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


exports.updateMovie = async ({ body, params }, res) => {
    try {
        const { id } = params;

        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).send({ message: 'Pelicula no encontrada' });
        }

        const updatedMovie = await movie.update(body);
        return res.status(200).send({
            message: 'Se actualizo el registro con exito',
            process: true,
            updatedMovie
        });

    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error, process: false });
        } else {
            res.status(500).json({ error: error.message, process: false });
        }
    }
}

exports.deleteMovie = async ({ params }, res) => {
    try {
        const { id } = params;

        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).send({ message: 'Pelicula no encontrada' });
        }

        const updatedMovie = await movie.update({ is_delete: 'true' });
        return res.status(200).send({
            message: 'Se elimino el registro con exito',
            process: true,
            updatedMovie
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error, process: false });
        } else {
            res.status(500).json({ error: error.message, process: false });
        }
    }
}