module.exports = (sequelize, DataType) => {
  const Comments = sequelize.define(
    "Comments",
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      comment: {
        type: DataType.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
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

      post_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      classMethods: {
        associate: (models) => {
          Comments.belongsTo(models.Users, {
            foreignKey: "user_id",
            as: "users",
          });
          Comments.belongsTo(models.Posts, {
            foreignKey: "post_id",
            as: "posts",
          });
        },
      },
    }
  );
  return Comments;
};
