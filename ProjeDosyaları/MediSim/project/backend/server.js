const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
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

// Vaka ekleme 
app.post('/cases', (req, res) => {
  console.log(">>> Gelen vaka verisi:", req.body);
  const {
    title,
    description,
    difficulty,
    category,
    duration,
    symptoms,
    temperature,
    blood_pressure,
    heart_rate,
    respiratory_rate,
    patient_age,
    patient_gender,
    medical_history,
    current_medications,
    tags
  } = req.body;

  const query = `
    INSERT INTO cases (
      title, description, difficulty, category, duration, symptoms,
      temperature, blood_pressure, heart_rate, respiratory_rate,
      patient_age, patient_gender, medical_history, current_medications, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    title, description, difficulty, category, duration, symptoms,
    temperature, blood_pressure, heart_rate, respiratory_rate,
    patient_age, patient_gender, medical_history, current_medications, tags
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Vaka eklenirken hata:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Vaka başarıyla eklendi", id: this.lastID });
  });
});

// Tüm vakaları listeleme
app.get('/cases', (req, res) => {
  db.all(`SELECT * FROM cases`, (err, rows) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    res.send(rows);
  });
});

// Belirli bir vakayı getirme
app.get('/cases/:id', (req, res) => {
  const caseId = req.params.id;
  
  db.get(
    'SELECT * FROM cases WHERE id = ?',
    [caseId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Case not found' });
      }
      res.json(row);
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
