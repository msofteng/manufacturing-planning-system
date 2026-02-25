-- This file allow to write SQL commands that will be emitted in test and dev.
-- The commands are commented as their support depends of the database

insert into product (id, code, name, price) values
(1, 'PRD-001', 'Industrial Motor', 450.0),
(2, 'PRD-002', 'Control Panel', 320.0),
(3, 'PRD-003', 'Hydraulic Pump', 780.0),
(4, 'PRD-004', 'Sensor Module', 150.0);
alter sequence product_seq restart with 5;

insert into raw_material (id, code, name, quantity) values
(1, 'RM-001', 'Steel Sheet', 500),
(2, 'RM-002', 'Aluminum Bar', 300),
(3, 'RM-003', 'Copper Wire', 1000),
(4, 'RM-004', 'Plastic Resin', 800),
(5, 'RM-005', 'Rubber Gasket', 200);
alter sequence raw_material_seq restart with 6;

insert into bill_of_material (id, product_id, raw_material_id, quantity) values
(1, 1, 1, 5),
(2, 1, 3, 10),
(3, 1, 5, 2),
(4, 2, 1, 2),
(5, 2, 3, 15),
(6, 2, 4, 3),
(7, 3, 1, 8),
(8, 3, 2, 4),
(9, 3, 5, 6),
(10, 4, 3, 5),
(11, 4, 4, 2);
alter sequence bill_of_material_seq restart with 12;