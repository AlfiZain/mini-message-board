const path = require('node:path');
const express = require('express');
const messagesController = require('./controllers/messagesController');

const app = express();
const PORT = 8080;

const links = [
  {
    name: 'home',
    href: '/',
  },
  {
    name: 'new message',
    href: '/messages/new',
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
app.use((req, res, next) => {
  res.locals.links = links;
  res.locals.messages = messages;
  next();
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Mini Message board',
    messages: messages,
  });
});

app.get('/messages/new', messagesController.messagesNewGet);

app.post('/messages/new', messagesController.messagesNewPost);

app.get('/messages/:username', messagesController.messagesDetailGet);

app.use((err, req, res, next) => {
  console.error(err);

  res
    .status(err.statusCode || 500)
    .send(err.message || 'Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
