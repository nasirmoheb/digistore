const express = require('express');
const morgan = require('morgan');

// ***********************/
// INITIALIZING

const app = express();

//*** */ MIDDLE WARES
app.use(express.json());

//development Loger
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.json({
    status: 'success',
    data: 'Hi this is first initialization'
  });
});

module.exports = app;
