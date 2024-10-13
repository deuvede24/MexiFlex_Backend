import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Recipe from './recipeModel.js';

const Favorite = sequelize.define('Favorite', {
  id_favorite: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user',
    },
    onDelete: 'CASCADE',
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id_recipe',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'favorites',
  timestamps: true, // Incluye createdAt y updatedAt
});

// Relaciones
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

Recipe.hasMany(Favorite, { foreignKey: 'recipe_id' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default Favorite;
