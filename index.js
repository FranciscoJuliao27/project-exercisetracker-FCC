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
    date: dateObj
  };

  const user = userRepository.getUserById(user_id);
  userRepository.addExerciseLog(user_id, exercise);
  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date.toDateString(),
    duration: Number(exercise.duration),
    description: exercise.description
  }); 
});

app.get('/api/users/:_id/logs', (req, res) =>{
  const user_id = req.params._id;
  const user = userRepository.getUserById(user_id);
  if (!user) {
    return res.status(404)
  }

  let { from, to, limit } = req.query;
  let logs = user.log;

  if (from) {
    const fromDate = new Date(from);
    logs = logs.filter(l => new Date(l.date) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    logs = logs.filter(l => new Date(l.date) <= toDate);
  }
  if (limit) {
    logs = logs.slice(0, Number(limit));
  }

  const logsFormatados = logs.map(l => ({
    ...l,
    date: new Date(l.date).toDateString()
  }));

  res.json({
    _id: user._id,
    username: user.username,
    count: logsFormatados.length,
    log: logsFormatados
  })
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});