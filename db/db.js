import mysql from 'mysql2/promise.js';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'blog',

  // Pool optimization settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

await db.query('SELECT 1');
console.log('Database connection successful');
