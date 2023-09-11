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
        foreignKey: 'movie_id',
        as: 'movie'
      })
    }
  }
  character.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    history: DataTypes.TEXT,
    weight: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'character',
  });
  return character;
};