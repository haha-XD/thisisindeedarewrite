const { Pool } = require('pg')

export default class Database {
    constructor() {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
        })
        this.db = {
            query: (text, params, callback) => {
                return pool.query(text, params, callback)
            }
        }
    }

    createAccountTable() {
        this.db.query(
            "CREATE TABLE accounts (" +
                "user_id serial PRIMARY KEY," + 
                "username VARCHAR ( 50 ) UNIQUE NOT NULL," +
                "password VARCHAR ( 50 ) NOT NULL," +
                "email VARCHAR ( 255 ) UNIQUE NOT NULL," +
                "created_on TIMESTAMP NOT NULL," +
                    "last_login TIMESTAMP " +
            ");",
            null,
            (err, res) => {
                console.log(err, res);
            }
        )
    }
}