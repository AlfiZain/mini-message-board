const path = require('node:path');
const express = require('express');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const PORT = 8080;

const links = [
  {
    name: 'home',
    href: '/',
  },
  {
    name: 'new message',
    href: '/new',
  },
];

const messages = [
  {
    text: 'Hi there!',
    user: 'Amando',
    added: new Date(),
  },
  {
    text: 'Hello World!',
    user: 'Charles',
    added: new Date(),
  },
];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Mini Messageboard',
    messages: messages,
    links: links,
  });
});

app.get('/new', (req, res) => {
  res.render('form', { title: 'Add new message', links: links });
});

app.post('/new', (req, res) => {
  const { user, text } = req.body;

  messages.push({ text, user, added: new Date() });
  res.redirect('/');
});

app.get('/messages/:username', (req, res) => {
  const username = req.params.username;
  const userMessage = messages.find((message) => message.user === username);

  if (!userMessage) throw new NotFoundError('User Not Found');

  res.render('detail-message', {
    title: `Message From ${userMessage.user}`,
    userMessage: userMessage,
    links: links,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res
    .status(err.statusCode || 500)
    .send(err.message || 'Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
