const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(" MediSim Backend Çalışıyor");
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, password],
    function (err) {
      if (err) {
        return res.status(500).send("Hata: " + err.message);
      }
      res.send({ message: "Kullanıcı eklendi", id: this.lastID });
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(` Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
