const express = require("express");
const app = express();
const port = 3001;
const db = require("./models");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Routers
const employeeRouter = require("./routes/Employees");
app.use("/employees", employeeRouter);

const offerRouter = require("./routes/Offers");
app.use("/offers", offerRouter);

const clientRouter = require("./routes/Clients");
app.use("/clients", clientRouter);

const setupRouter = require("./routes/Setups");
app.use("/setups", setupRouter);

const controlRouter = require("./routes/Controls");
app.use("/controls", controlRouter);

const bonusRouter = require("./routes/Bonuses");
app.use("/bonuses", bonusRouter);

const reportRouter = require("./routes/Reports");
app.use("/reports", reportRouter);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
