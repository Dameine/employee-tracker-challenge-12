const inquirer = require('inquirer');
const pg = require('pg');
const { Pool } = pg;

const PORT = process.env.PORT || 3001;
let connected = false;  // Variable to track database connection

// Connect to PG
const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db',
    port: 5432
});

pool.connect((err) => {
    if (err) {
        console.log('Error connecting to the database');
        process.exit(1);
    } else {
        connected = true;  // Set the connection flag to true
        console.log('Connected to the database');
        menu();  // Start the menu only after successful connection
    }
});

// Start server
const menu = () => {
    if (!connected) return;  // Prevent menu from running if not connected
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(({ choice }) => {
        switch (choice) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                process.exit();
        }
    });
};

// View all departments
const viewDepartments = () => {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.log("Error fetching department", err);
            return;
        } else {
            console.table(res.rows);
            menu();
        }
    });
};

// View all roles
const viewRoles = () => {
    const query = `
    SELECT employee_role.role_id, employee_role.title, department.department_name AS department, employee_role.salary 
    FROM employee_role 
    JOIN department ON employee_role.department_id = department.department_id`;
    pool.query(query, (err, res) => {
        if (err) {
            console.log("Error fetching roles", err);
            return;
        } else {
            console.table(res.rows);
            menu();
        }
    });
};

// View all employees
const viewEmployees = () => {
    const query = `
    SELECT employee.employee_id, employee.first_name, employee.last_name, employee_role.title AS role, department.department_name AS department, employee_role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN employee_role ON employee.role_id = employee_role.role_id
    JOIN department ON employee_role.department_id = department.department_id
    LEFT JOIN employee manager ON employee.manager_id = manager.employee_id`;
    pool.query(query, (err, res) => {
        if (err) {
            console.log("Error fetching employees", err);
            return;
        } else {
            console.table(res.rows);
            menu();
        }
    });
};

// Add a department
const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'Enter the name of the department'
    }).then(({ department }) => {
        pool.query('INSERT INTO department (department_name) VALUES ($1)', [department], (err, res) => {
            if (err) {
                console.error('Error adding department', err);
            } else {
                console.log('Department added');
            }
            menu();
        });
    });
};

// Add a role
const addRole = () => {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error('Error fetching departments', err);
            menu();
        } else {
            const departments = res.rows.map(department => ({
                name: department.department_name,
                value: department.department_id
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary of the role'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department of the role',
                    choices: departments
                }
            ]).then(({ title, salary, department }) => {
                pool.query('INSERT INTO employee_role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department], (err, res) => {
                    if (err) {
                        console.error('Error adding role', err);
                    } else {
                        console.log('Role added');
                    }
                    menu();
                });
            });
        }
    });
};

// Add an employee
const addEmployee = () => {
    pool.query('SELECT * FROM employee_role', (err, res) => {
        if (err) {
            console.error('Error fetching roles', err);
            menu();
        } else {
            const roles = res.rows.map(role => ({
                name: role.title,
                value: role.role_id
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name of the employee'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name of the employee'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the role of the employee',
                    choices: roles
                }
            ]).then(({ first_name, last_name, role }) => {
                pool.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [first_name, last_name, role], (err, res) => {
                    if (err) {
                        console.error('Error adding employee', err);
                    } else {
                        console.log('Employee added');
                    }
                    menu();
                });
            });
        }
    });
};


// Update an employee role
const updateEmployeeRole = () => {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error('Error fetching employees', err);
            menu();
        } else {
            const employees = res.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.employee_id
            }));

            pool.query('SELECT * FROM employee_role', (err, res) => {
                if (err) {
                    console.error('Error fetching roles', err);
                    menu();
                } else {
                    const roles = res.rows.map(role => ({
                        name: role.title,
                        value: role.role_id
                    }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Select the employee to update',
                            choices: employees
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Select the new role',
                            choices: roles
                        }
                    ]).then(({ employee, role }) => {
                        pool.query('UPDATE employee SET role_id = $1 WHERE employee_id = $2', [role, employee], (err, res) => {
                            if (err) {
                                console.error('Error updating employee role', err);
                            } else {
                                console.log('Employee role updated');
                            }
                            menu();
                        });
                    });
                }
            });
        }
    });
};

// Start the menu
menu();
