'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class character_movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  character_movie.init({
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Movie',
        key: 'id'
      }
    },
    character_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'character',
        key: 'id'
      }
    },
    is_delete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'character_movie',
  });
  return character_movie;
};