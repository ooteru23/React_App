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

//package json lama
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

//fungsi save ke database control
const handleSaveToControl = (e) => {
e.preventDefault();

    const saveToControl = filteredSetup.map((setup) => ({
      client_name: setup.client_candidate,
      employee1: setup.employee1,
      employee2: setup.employee2,
      net_value1: setup.net_value1,
      net_value2: setup.net_value2,
    }));

    Swal.fire({
      title: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:3001/controls/creating-data", saveToControl)
          .then((response) => {
            console.log("Data Added:", response.data);
          })
          .catch((error) => {
            toast.error("Error Adding Data", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.error("Error Adding Data", error);
          });
        Swal.fire({
          title: "Saved!",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
      }
    });

};

// fungsi control lama
useEffect(() => {
axios
.get("http://localhost:3001/offers")
.then((response) => {
setListOfOffer(response.data);
})
.catch((error) => {
console.error("Error Getting Data:", error);
});
}, []);

useEffect(() => {
axios
.get("http://localhost:3001/clients/")
.then((response) => {
setListOfClient(response.data);
})
.catch((error) => {
console.error("Error Getting Data:", error);
});
}, []);

employee1: {
type: DataTypes.STRING,
allowNull: false,
},
employee2: {
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

const handleCheckData = (e) => {
e.preventDefault();

    const filtered = listOfControl
      .filter((control) => {
        const client = listOfClient.find(
          (client) => client.client_name === control.client_name
        );
        return client && client.client_status === "Active";
      })
      .filter((control) => {
        const isEmployeeMatch =
          !selectedEmployee ||
          control.employee1 === selectedEmployee ||
          control.employee2 === selectedEmployee;

        const isYearMatch = listOfOffer.some(
          (offer) =>
            offer.client_candidate === control.client_name &&
            new Date(offer.period_time).getFullYear() ===
              Number(currentYear, 10)
        );
        return isEmployeeMatch && isYearMatch;
      });

    setFilteredControl(filtered);

};

const [listOfClient, setListOfClient] = useState([]);
const [listOfOffer, setListOfOffer] = useState([]);
