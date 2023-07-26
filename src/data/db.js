import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./src/data/data.sqlite3', (err) => {
    if (err) {
        console.error("Error connecting to the database: ", err.message);
    } else {
        console.log("Connected to the database.");
    }
});

export default db;