const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors()); // ✅ frontend erişimi için şart
app.use(express.json());

app.get('/', (req, res) => {
  res.send("MediSim Backend Çalışıyor");
});

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).send({ message: "Eksik bilgi gönderildi." });
  }

  db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, password, role],
    function (err) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.send({ message: "Kullanıcı eklendi", id: this.lastID });
    }
  );
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "Kullanıcı adı ve şifre gerekli." });
  }

  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (row) {
        res.send({ message: "Giriş başarılı", user: row });
      } else {
        res.status(401).send({ message: "Kullanıcı bulunamadı veya şifre yanlış!" });
      }
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
