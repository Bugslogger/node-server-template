module.exports = (connection, Sequelize) => {
  const User = connection.define(
    "users",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      uid: { type: Sequelize.STRING, unique: true }, // unique identifier
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address.",
          },
          notEmpty: {
            msg: "Email cannot be empty.",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Active", "Disabled", "Suspended"],
        defaultValue: "Active",
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdon: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedon: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false, // Disable automatic timestamps
    }
  );

  return User;
};
