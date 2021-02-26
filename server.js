const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Envoirment var config
dotenv.config({ path: './config.env' });

//handling uncaughtException
process.on('uncaughtException', err => {
  // console.log(err);
  console.log('(💥uncaughtException) Shutting down System .........*******');
  process.exit(1);
});

//importing the app file
const app = require('./app');

//Database connection
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//handling uncaughtException
process.on('unhandledRejection', err => {
  console.log(err);
  console.log('(💥unhandledRejection) Shutting down System .........*******');
  server.close(() => {
    process.exit(1);
  });
});
