'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Movie.belongsTo(models.Genders, {
        foreignKey: 'gender_id',
        as: 'genders'
      })

      Movie.belongsToMany(models.character, {
        through: 'character_movie',
        foreignKey: 'character_id',
        as: 'character'
      })
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    publication_date: DataTypes.DATE,
    qualification: DataTypes.INTEGER,
    gender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Gender',
        key: id
      }
    }
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};