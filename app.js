const path = require('node:path');
const express = require('express');
const messagesController = require('./controllers/messagesController');
const db = require('./db/queries');

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.links = links;
  next();
});

app.get('/', async (req, res) => {
  const messages = await db.getAllMessages();

  res.render('index', {
    title: 'Mini Message board',
    messages,
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
