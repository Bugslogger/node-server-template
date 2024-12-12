module.exports = (connection, Sequelize) => {
  const User = connection.define(
    "users",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      fullname: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
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
