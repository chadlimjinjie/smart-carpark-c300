const mysql = require('mysql');

const DB_HOST = "c300.mysql.database.azure.com";
const DB_USER = "default@c300";
const DB_PASS = "@Republic1";

const connection = mysql.createPool({
    host: DB_HOST, // c300-fyp.mysql.database.azure.com, project-c300.mysql.database.azure.com
    port: 3306,
    user: DB_USER, // default@project-c300
    password: DB_PASS, // R@CLwQJw190, @Republic1
    database: 'integration_dev3',
    ssl: true
});

module.exports = connection;