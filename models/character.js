'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      character.belongsToMany(models.Movie, {
        through: 'character_movie',
        foreignKey: 'character_id',
        otherKey: 'movie_id',
        as: 'movie'
      })
    }
  }
  character.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre es obligatorio'
        },
        notEmpty: {
          msg: 'El nombre no puede estar vacio'
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La edad es obligatorio'
        },
        notEmpty: {
          msg: 'La edad no puede estar vacio'
        },
        isNumeric: {
          msg: 'La edad tiene que ser un campo numerico'
        }
      }
    },
    history: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La historia es obligatorio'
        },
        notEmpty: {
          msg: 'La historia no puede estar vacio'
        }
      }
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El peso es obligatorio'
        },
        notEmpty: {
          msg: 'El peso no puede estar vacio'
        },
        isNumeric: {
          msg: 'El peso tiene que ser un campo numerico'
        }
      }
    },
    image: DataTypes.STRING,
    is_delete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'character',
    tableName: 'character'
  });
  return character;
};