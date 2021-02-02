const mongoose = require('mongoose');
const dotenv = require('dotenv');
const server = require('./app');

//Envoirment var config
dotenv.config({ path: './config.env' });

//Database connection
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err);
  console.log('(💥unhandledRejection) Shutting down System .........*******');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log(err);
  console.log('(💥uncaughtException) Shutting down System .........*******');
  server.close(() => {
    process.exit(1);
  });
});
