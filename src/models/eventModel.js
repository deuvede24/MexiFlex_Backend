import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";


const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('receta', 'restaurante', 'feria'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'events',
  indexes: [
    {
      unique: true,
      fields: ['title', 'date'],
    },
  ],
});

export default Event;