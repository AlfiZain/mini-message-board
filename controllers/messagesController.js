const { body, validationResult, matchedData } = require('express-validator');
const NotFoundError = require('../errors/NotFoundError');

const validateMessage = [
  body('user')
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
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('form', {
        title: 'Add new message',
        errors: errors.array(),
      });
    }

    const { user, text } = matchedData(req);

    res.locals.messages.push({ text, user, added: new Date() });
    res.redirect('/');
  },
];

exports.messagesDetailGet = (req, res) => {
  const username = req.params.username;
  const userMessage = res.locals.messages.find(
    (message) => message.user === username,
  );

  if (!userMessage) throw new NotFoundError('User Not Found');

  res.render('detail-message', {
    title: `Message From ${userMessage.user}`,
    userMessage: userMessage,
  });
};
