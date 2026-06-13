const pool = require('./pool');

async function getAllMessages() {
  const { rows } = await pool.query('SELECT * FROM messages');
  return rows;
}

async function getMessagesByUsername(username) {
  const { rows } = await pool.query(
    'SELECT * FROM messages WHERE username LIKE $1',
    [`%${username}%`],
  );

  return rows;
}

async function createMessage({ username, text }) {
  await pool.query('INSERT INTO messages (username, text) VALUES ($1, $2)', [
    username,
    text,
  ]);
}

module.exports = {
  getAllMessages,
  getMessagesByUsername,
  createMessage,
};
