const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const userRepository = require('./userRepository');

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const user = userRepository.addNewUser(username);
  res.json({ username: user.username, _id: user._id });
});

app.get('/api/users', (req, res) => {
  const users = userRepository.getAllUsers();
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) =>{
  const user_id = Number(req.params._id);
  let dateObj;

  if (req.body.date){
    dateObj = new Date(req.body.date);
  } else {
    dateObj = new Date()
  }

  const exercise = {
    description: req.body.description,
    duration: Number(req.body.duration),
    date: dateObj.toDateString()
  };

  console.log(exercise);
  const user = userRepository.getUserById(user_id);
  userRepository.addExerciseLog(user_id, exercise);
  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date,
    duration: Number(exercise.duration),
    description: exercise.description
  }); 
});

app.get('/api/users/:_id/logs', (req, res) =>{
  console.log(req.params);
  user = userRepository.getUserById(req.params._id);
  console.log(user)
  if (user) {
    res.json(user);
  } else {
    res.status(404)
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});