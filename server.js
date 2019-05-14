const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');
const morgon = require('morgan');
const server = express();

// Build in middleware
server.use(express.json());

// Third party middleware
server.use(helmet());
server.use(morgon('dev'));

// Custom middleware
server.use(typeLogger);
server.use(addName);
// server.use(lockout)
// server.use(moodyGatekeeper);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res, next) => {
  const nameInsert = req.name ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function typeLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || 'Dexter';
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: 'API lockout' });
}

function moodyGatekeeper(req, res, next) {
  const number = Math.floor(Math.random() * Math.floor(3));
  if (number === 2) {
    res.status(403).json({ message: 'You shall not pass' });
  } else {
    next();
  }
}

// Catch all error handlers will be placed at the bottom before our export
server.use((err, req, res, next) => {
  res.status(500).json({ message: 'Bad panda', err });
  
});

module.exports = server;
