import mysql from 'mysql2/promise';

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
