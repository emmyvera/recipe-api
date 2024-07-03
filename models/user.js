import bcrypt from "bcrypt";

module.exports = (sequelize, DataType) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },

      first_name: {
        type: DataType.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: DataType.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataType.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      image_url: {
        type: DataType.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    }
  );
  Users.isPassword = (encodedPassword, password) => {
    return bcrypt.compareSync(password, encodedPassword);
  };

  Users.getUserById = async (id) => {
    try {
      const user = await Users.findOne({
        attributes: ["first_name", "last_name"],
        where: { id },
      });
      return { first_name: user.first_name, last_name: user.last_name };
    } catch (error) {
      throw new Error("User not found");
    }
  };

  Users.associate = (models) => {
    Users.hasMany(models.Recipes, { foreignKey: "user_id" });
    Users.hasMany(models.Posts, { foreignKey: "user_id" });
  };
  return Users;
};
