\c "e-commerce"

DELETE FROM users;

INSERT INTO users (username, password)
VALUES ('admin', '$2b$10$ilk0hVfO3Ge/MEKv85gkwOnnYrudejggVKbKdG8fxrxTtbTejJ89G'), -- secret
('developer', '$2b$10$/.HW48n8k3AIjn3rO1.l1eXo7lyFPE4Ue2DQ9eGJj4xRHrt17I44u'), -- apple
('person', '$2b$10$Lq0KSDa3Erd6g1PPi7aF0ewRmZu894FbS63FVEPZJqgJybAxr/7CW'); -- friend