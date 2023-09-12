'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Movie.belongsTo(models.Gender, {
        foreignKey: 'gender_id',
        as: 'gender'
      })

      Movie.belongsToMany(models.character, {
        through: 'character_movie',
        foreignKey: 'movie_id',
        otherKey: 'character_id',
        as: 'character'
      })
    }
  }
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El titulo es un campo obligatorio'
        },
        notEmpty: {
          msg: 'El titulo no puede estar vacio'
        }
      }
    },
    publication_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La fecha de publicacion es obligatorio'
        },
        notEmpty: {
          msg: 'la fecha de publicacion no puede estar vacio'
        }
      }
    },
    qualification: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La califacion es obligatorio'
        },
        notEmpty: {
          msg: 'La califacion no puede estar vacio'
        }
      }
    },
    gender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Gender',
        key: 'id'
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El genero es obligatorio'
        },
        notEmpty: {
          msg: 'El genero no puede estar vacio'
        }
      }
    },
    is_delete: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'movie'
  });
  return Movie;
};