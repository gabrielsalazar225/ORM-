const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
class Tag extends Model {}

Tag.init(
  {
    // define columns
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},

tag_name: {
  type: DataTypes.INTEGER,
  allowNull: true
}
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;
