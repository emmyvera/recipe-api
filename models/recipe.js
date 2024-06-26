module.exports = (sequelize, DataType) => {
  const Recipes = sequelize.define("Recipes", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    food_name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    description: {
      type: DataType.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    ingredients: {
      type: DataType.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    preparation: {
      type: DataType.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    image_url: {
      type: DataType.STRING,
      allowNull: true,
    },

    video_url: {
      type: DataType.STRING,
      allowNull: true,
    },

    views: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    user_id: {
      type: DataType.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });
  Recipes.associate = (models) => {
    Recipes.belongsTo(models.Users, { foreignKey: "user_id" });
    Recipes.hasMany(models.Reviews, { foreignKey: "recipe_id" });
  };

  return Recipes;
};
