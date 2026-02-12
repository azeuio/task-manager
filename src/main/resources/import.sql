INSERT INTO users (id, username, email) VALUES (1, 'alice', 'alice@example.com');
INSERT INTO users (id, username, email) VALUES (2, 'bob', 'bob@example.com');

INSERT INTO projects (id, name, owner_id, status) VALUES (1, 'Project 1', 1, 0);
INSERT INTO projects (id, name, owner_id, status) VALUES (2, 'Project 2', 1, 0);
INSERT INTO projects (id, name, owner_id, status) VALUES (3, 'Project 3', 2, 0);

-- INSERT INTO tasks (id, title, description, project_id) VALUES (1, 'Task 1', 'Description for Task 1', 1);
-- INSERT INTO tasks (id, title, description, project_id) VALUES (2, 'Task 2', 'Description for Task 2', 1); 
-- INSERT INTO tasks (id, title, description, project_id) VALUES (3, 'Task 3', 'Description for Task 3', 2);
-- INSERT INTO tasks (id, title, description, project_id) VALUES (4, 'Task 4', 'Description for Task 4', 3);
