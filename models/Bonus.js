module.exports = (sequelize, DataTypes) => {
  const Bonuses = sequelize.define("Bonuses", {
    employee_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
  });

  return Bonuses;
};
