
INSERT INTO users (username, password, first_name, last_name, email, phone_number, is_admin)
VALUES(
    'testOwner',
     'password',
      'test',
      'owner',
      'testOwner@user.com',
       1234567890,
        FALSE
),
(
        'testOwner2',
     'password',
      'test2',
      'owner2',
      'testOwner2@user.com',
       0987654321,
        FALSE
);


INSERT INTO pets(name, age, species, hunger, description, user_id)
VALUES (
    'max',
    '4',
    'dog',
    '50',
    'he is a dog',
    1
),
(
    'spike',
    '3',
    'dog',
    '75',
    'he is a dog',

    1
);