module.exports = (sequelize, DataTypes) => {
  const Bonuses = sequelize.define("Bonuses", {
    // employee_name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    work_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    net_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disbursement_bonus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Bonuses;
};
