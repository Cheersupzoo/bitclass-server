const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const cors = require("cors");
const app = express();
const pack = require("../package");
const path = require("path");
// if NODE_ENV value not define then dev value will be assign
const mode = process.env.NODE_ENV || "dev";
// mode can be access anywhere in the project
// const config = require('config').get(mode);

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// use only when you want to see the metric related to express app
// app.use(require('express-status-monitor')());

require("./routes")(app);
// const dir = path.join(__dirname, 'assets');

const port = (process.env.PORT || 4000);
const start = () =>
  app.listen(port, () => {
    console.log(chalk.yellow("......................................."));
    console.log(chalk.green("BitClass-server"));
    console.log(chalk.green(`Port:\t\t${port}`));
    console.log(chalk.green(`Mode:\t\tDev`));
    console.log(chalk.green(`App version:\t${pack.version}`));
    // console.log(chalk.green("database connection is established"));
    console.log(chalk.yellow("......................................."));
  });

start();
