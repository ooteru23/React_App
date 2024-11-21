module.exports = (sequelize, DataTypes) => {
  const Setups = sequelize.define("Setups", {
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contract_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commission_price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    software_price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    percent1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    percent2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    net_value1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    net_value2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Setups;
};
