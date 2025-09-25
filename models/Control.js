﻿module.exports = (sequelize, DataTypes) => {
  const Controls = sequelize.define("Controls", {
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    month_jan: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_feb: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_mar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_apr: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_may: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_jun: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_jul: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_aug: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_sep: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_oct: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_nov: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
    month_dec: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ON PROCESS",
    },
  });

  return Controls;
};
