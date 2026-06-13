const { body, validationResult, matchedData } = require('express-validator');
const NotFoundError = require('../errors/NotFoundError');
const db = require('../db/queries');

const validateMessage = [
  body('username')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 12 })
    .withMessage('Username must be between 1 and 12 characters'),
  body('text')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 220 })
    .withMessage('Message cannot over 220 characters'),
];

exports.messagesNewGet = (req, res) => {
  res.render('form', { title: 'Add new message' });
};

exports.messagesNewPost = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('form', {
        title: 'Add new message',
        errors: errors.array(),
      });
    }

    const { username, text } = matchedData(req);
    await db.createMessage({ username, text });

    res.redirect('/');
  },
];

exports.messagesDetailGet = async (req, res) => {
  const username = req.params.username;
  const userMessages = await db.getMessagesByUsername(username);

  if (userMessages.length === 0) {
    throw new NotFoundError('User Not Found');
  }

  res.render('detail-message', {
    title: `Messages From ${username}`,
    userMessages,
  });
};
