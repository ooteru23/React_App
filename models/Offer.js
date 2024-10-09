module.exports = (sequelize, DataTypes) => {
  const Offers = sequelize.define("Offers", {
    creator_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_candidate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marketing_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid_date: {
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
    period_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    information: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offer_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
  });

  return Offers;
};
