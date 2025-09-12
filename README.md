# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

// config.json lama
{
"development": {
"username": "root",
"password": "",
"database": "db_sniconsulting",
"host": "localhost",
"dialect": "mysql"
},
"test": {
"username": "root",
"password": null,
"database": "database_test",
"host": "127.0.0.1",
"dialect": "mysql"
},
"production": {
"username": "root",
"password": null,
"database": "database_production",
"host": "127.0.0.1",
"dialect": "mysql"
}
}

//model/index.js lama
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(**filename);
const env = process.env.NODE_ENV || "development";
const config = require(**dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
sequelize = new Sequelize(
config.database,
config.username,
config.password,
config
);
}

fs.readdirSync(**dirname)
.filter((file) => {
return (
file.indexOf(".") !== 0 &&
file !== basename &&
file.slice(-3) === ".js" &&
file.indexOf(".test.js") === -1
);
})
.forEach((file) => {
const model = require(path.join(**dirname, file))(
sequelize,
Sequelize.DataTypes
);
db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
if (db[modelName].associate) {
db[modelName].associate(db);
}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

{
"name": "bonus-calculation-app",
"homepage": "https://ooteru23.github.io/React_App",
"private": true,
"version": "0.0.0",
"type": "commonjs",
"scripts": {
"dev": "vite",
"build": "vite build",
"lint": "eslint .",
"preview": "vite preview",
"start": "nodemon server.js",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
},
"dependencies": {
"@fortawesome/free-solid-svg-icons": "^6.6.0",
"@fortawesome/react-fontawesome": "^0.2.2",
"@popperjs/core": "^2.11.8",
"axios": "^1.7.7",
"bootstrap": "^5.3.3",
"cors": "^2.8.5",
"express": "^4.21.0",
"hamburger-react": "^2.5.1",
"moment": "^2.30.1",
"mysql2": "^3.11.3",
"nodemon": "^3.1.7",
"react": "^18.3.1",
"react-bootstrap": "^2.10.5",
"react-dom": "^18.3.1",
"react-router-dom": "^6.26.2",
"react-select": "^5.8.3",
"react-toastify": "^10.0.6",
"sequelize": "^6.37.3",
"sequelize-cli": "^6.6.2",
"sqlite3": "^5.1.7",
"sweetalert2": "^11.6.13"
},
"devDependencies": {
"@eslint/js": "^9.11.1",
"@types/react": "^18.3.3",
"@types/react-dom": "^18.3.0",
"@vitejs/plugin-react": "^4.3.1",
"concurrently": "^9.2.1",
"cross-env": "^10.0.0",
"electron": "^37.4.0",
"electron-builder": "^26.0.12",
"eslint": "^9.11.1",
"eslint-plugin-react": "^7.36.1",
"eslint-plugin-react-hooks": "^5.1.0-rc.0",
"eslint-plugin-react-refresh": "^0.4.9",
"gh-pages": "^6.3.0",
"globals": "^15.9.0",
"vite": "^5.4.1",
"wait-on": "^8.0.4"
},
"description": "This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.",
"main": "eslint.config.js",
"author": "",
"license": "ISC",
"repository": {
"type": "git",
"url": "git+https://github.com/ooteru23/React_App.git"
},
"bugs": {
"url": "https://github.com/ooteru23/React_App/issues"
}
}

"dev:ui": "vite",
"dev:electron": "cross-env VITE_DEV=true electron .",
"dev:all": "concurrently -k \"npm:dev:ui\" \"wait-on http://localhost:5173 && npm:dev:electron\"",
