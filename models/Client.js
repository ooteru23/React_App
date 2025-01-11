module.exports = (sequelize, DataTypes) => {
  const Clients = sequelize.define("Clients", {
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contract_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Clients;
};
