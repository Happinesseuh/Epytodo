const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path')

class user_info {

  constructor(firstname, name, password, email, id, created_at) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.firstname = firstname;
    this.name = name;
  }
}
const user = new user_info(null, null, null, null, null, null);

module.exports = user;

const todoRoute = require('./routes/todos/todos');
const userRoute = require('./routes/user/user');
const authRoute = require('./routes/auth/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/todo', todoRoute);
app.use('/user', userRoute);
app.use('/', authRoute)

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname + '/home.html'))
})

.get('/login', (_, res) => {
  res.sendFile(path.join(__dirname + '/login.html'))
})

.get('/register', (_, res) => {
  res.sendFile(path.join(__dirname + '/register.html'))
})

app.use(function(err, req, res, next) {
  res.status(500).json({"msg": "internal server error"});
})

app.get('*', function(req, res) {
  res.status(404).json({"msg": "Not found"});
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})