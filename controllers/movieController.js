const { ValidationError, Op } = require('sequelize');
const { Movie } = require('../models');

exports.getAllMovies = async ({ query }, res) => {
    try {
        if (Object.keys(query).find(key => key == 'title')) {
            query = {
                ...query,
                title: {
                    [Op.like]: `%${query['title']}%`
                }
            };
        }
        const movies = await Movie.findAll({
            where: {
                is_delete: false,
                ...query
            }
        });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createMovie = async ({ body }, res) => {
    try {
        const { dataValues } = await Movie.create(body);
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