CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NULL CHECK (position('@' IN email) > 1),
    phone_number BIGINT,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age TEXT,
    species TEXT NOT NULL,
    hunger INTEGER NOT NULL,
    description VARCHAR(250),
    user_id INTEGER NOT NULL 
    REFERENCES users ON DELETE CASCADE    
);