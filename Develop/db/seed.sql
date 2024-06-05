INSERT INTO department (department_name)
VALUES ('Marketing'),
       ('Engineering'),
       ('Finance'),
       ('Sales');

INSERT INTO employee_role (title, salary, department_id)
VALUES ('Marketing Manager', 150000, 1),
       ('Mechanical Designer', 80000, 2),
       ('Accountant', 90000, 3),
       ('Sales Associate', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Chris', 'Evans', 1, 1),
       ('Bob', 'Rogers', 2, NULL),
       ('Justin', 'Jefferson', 3, 1),
       ('Anthony', 'Edwards', 4, 1);