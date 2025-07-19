const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'medisim.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(" Veritabanı bağlantı hatası:", err.message);
  } else {
    console.log(" SQLite veritabanına başarıyla bağlanıldı!");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);
});


module.exports = db;
