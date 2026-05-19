const express = require('express');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Club Management System API');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Member API Endpoints (NEW-34)

// GET /members - List all members
app.get('/members', (req, res) => {
  db.all('SELECT * FROM members', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET /members/:id - Get a single member
app.get('/members/:id', (req, res) => {
  db.get('SELECT * FROM members WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }
    res.json(row);
  });
});

// POST /members - Create a new member
app.post('/members', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  const id = uuidv4();
  const sql = 'INSERT INTO members (id, name, email, role) VALUES (?, ?, ?, ?)';
  const params = [id, name, email, role || 'member'];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id, name, email, role: role || 'member' });
  });
});

// PUT /members/:id - Update a member
app.put('/members/:id', (req, res) => {
  const { name, email, role } = req.body;
  const sql = 'UPDATE members SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role) WHERE id = ?';
  const params = [name, email, role, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }
    res.json({ message: 'Member updated successfully' });
  });
});

// DELETE /members/:id - Delete a member
app.delete('/members/:id', (req, res) => {
  db.run('DELETE FROM members WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }
    res.json({ message: 'Member deleted successfully' });
  });
});

db.init().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
