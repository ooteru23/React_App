module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define("Reports", {
    employee_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary_deduction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month_ontime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month_late: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bonus_component: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    percent_ontime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    percent_late: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_ontime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_late: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bonus_ontime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bonus_late: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Reports;
};
