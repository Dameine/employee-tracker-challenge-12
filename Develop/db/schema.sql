DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(30)
);

CREATE TABLE employee_role (
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES employee_role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);