module.exports = (sequelize, DataTypes) => {
  const Employees = sequelize.define("Employees", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Employees;
};
