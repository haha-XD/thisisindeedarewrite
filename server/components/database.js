import * as pg from 'pg'
const { Pool } = pg.default;

export default class Database {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
        })
    }

    query(text, params, callback) {
        return this.pool.query(text, params, callback)
    }

    createAccountTable() {
        this.db.query(
            "CREATE TABLE accounts (" +
                "user_id serial PRIMARY KEY GENEREATED BY DEFAULT AS IDENTITY," + 
                "username VARCHAR ( 50 ) UNIQUE NOT NULL," +
                "password VARCHAR ( 50 ) NOT NULL," +
            ");",
            null,
            (err, res) => {
                console.log(err, res);
            }
        )
    }
}