// const Sequelize = require("sequelize");

// const db = {};
// const sequelize = new Sequelize(
//    'schoolmanagement',
//    'jyotip',
//    'Jyoti@2002',
//     {
//       host: 'localhost',
//       dialect: 'mysql'
//     }
//   );

// sequelize.authenticate().then(() => {
//    console.log('Connection has been established successfully.');
// }).catch((error) => {
//    console.error('Unable to connect to the database: ', error);
// });

// db.sequelize = sequelize;

// module.exports = db

const Sequelize = require("sequelize");

const db = {};
export const sequelize = new Sequelize("schoolmanagement", "jyotip", "Jyoti@2002", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database: ", error);
  });