module.exports = (sequelize, DataType) => {
  const Posts = sequelize.define(
    "Posts",
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
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
    },
    {
      classMethods: {
        associate: (models) => {
          Posts.hasMany(models.Comment, {
            foreignKey: "post_id",
            as: "comment",
          });
          Posts.belongsTo(models.Users, {
            foreignKey: "user_id",
            as: "users",
          });
        },
      },
    }
  );
  return Posts;
};
