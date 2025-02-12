const {Sequelize, DataTypes} = require("sequelize");

export const sequelize = new Sequelize("tasksscheduler", "jyotip", "Jyoti@2002", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define(
  'Users',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.INTEGER,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  },
)

const Task = sequelize.define(
  'Tasks',{
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
    },
    end_time: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    },
    tags: {
      type: DataTypes.STRING,
    },
    repeat_freq:{
      type: DataTypes.INTEGER,
    },
    remind_time: {
      type: DataTypes.INTEGER,
    },
    colour:{
      type: DataTypes.STRING,
      default: "#FFFFFF"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }
)

sequelize.sync();
console.log('All models were synchronized successfully.');

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database: ", error);
  });