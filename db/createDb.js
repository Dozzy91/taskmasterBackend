const { Client } = require('pg');
const { Pool } = require('pg');


// Connect to the database
const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

// DB Schema
const dbName = 'taskmaster';
const createDatabase = `CREATE DATABASE ${dbName};`;

// create DB tables
const createUsers_Table = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
`;

const createTask_Table = `
CREATE TYPE priority AS ENUM('low','medium','high');


CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    description TEXT,
    priority PRIORITY NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createToken_blacklist_Table = `
CREATE TABLE IF NOT EXISTS token_blacklist (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    blacklisted_at TIMESTAMP DEFAULT NOW()
);
`;

async function createTables() {
    // connect to taskmaster database
    const pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
    });

    try {
        
        await pool.query(createUsers_Table);
        if (process.env.NODE_ENV !== 'test') {
            console.log('User Table created successfully')
        }
        
        await pool.query(createTask_Table);
        if (process.env.NODE_ENV !== 'test') {
            console.log('Task table created sucessfully');
        }
        
        await pool.query(createToken_blacklist_Table);
        if (process.env.NODE_ENV !== 'test') {
            console.log('List created successfully!');
        }

    } catch (error) {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Error creating Tables:', error.message);
        }
    }
};

async function dbCreate() {

    // connect to pg server
    const client = new Client ({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: 'postgres',
    port: process.env.PG_PORT
    });

    try {
        await client.connect()
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to PostgreSQL server.');
        }

        const checkDB = `SELECT 1 FROM pg_database WHERE datname = $1;`

        const DbExists = await client.query(checkDB, [dbName]);

        if(DbExists.rows.length > 0) {
            if (process.env.NODE_ENV !== 'test') {
                console.log(`Skipping process...`);
            }
        } else {
            await client.query(createDatabase);
            if (process.env.NODE_ENV !== 'test') {
                console.log('Database taskmaster created successfully.');
            }
            await createTables();
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Error creating database:', error.message);
        }
    } finally {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Done');
        }
        await client.end();
    }
};
module.exports = { dbCreate };