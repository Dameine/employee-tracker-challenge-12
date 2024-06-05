const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;

// Connect to PG
const pool = new Pool({
    user: 'postgres',
    password: 'Daedae0420',
    host: 'localhost',
    database: 'employee_db',
});

pool.connect();
