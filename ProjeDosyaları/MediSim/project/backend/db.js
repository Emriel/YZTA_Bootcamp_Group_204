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

// Users tablosu
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

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT,
      category TEXT,
      duration INTEGER,
      symptoms TEXT,
      temperature TEXT,
      blood_pressure TEXT,
      heart_rate TEXT,
      respiratory_rate TEXT,
      patient_age INTEGER,
      patient_gender TEXT,
      medical_history TEXT,
      current_medications TEXT,
      tags TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);
});

module.exports = db;