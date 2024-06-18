import Users from "./user";
import Recipes from "./recipe";

module.exports = (sequelize, DataType) => {
  const Reviews = sequelize.define(
    "Reviews",
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      description: {
        type: DataType.TEXT,
        allowNull: true,
      },

      rate: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      recipe_id: {
        type: DataType.INTEGER,
        references: {
          model: "recipes",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      user_id: {
        type: DataType.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },

    {
      classMethods: {
        associate: (models) => {
          Reviews.belongsTo(models.Recipes, {
            foreignKey: "recipe_id",
          });
          Reviews.belongsTo(models.Users, {
            foreignKey: "user_id",
          });
        },
      },
    }
  );
  return Reviews;
};
