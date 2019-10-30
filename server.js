/**
 *
 * entrez la commande suivante:
 * npm install --save express express-session body-parser morgan cors
 * puis node server.js
 * exemple complet à l'adresse https://github.com/Musinux/first-vue-app
 */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

const app = express()

// ces lignes (cors) sont importantes pour les sessions dans la version de développement
app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080'
}))
app.use(session({
  secret: 'blablabla', // changez cette valeur
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ne changez que si vous avez activé le https
}))
app.use(morgan('dev'))
app.use(bodyParser.json())

const path = require('path')
app.use(express.static(path.join(__dirname, '/dist')))

const users = [{
  login: 'admin',
  password: 'changethispassword',
  todoList: []
}]

app.post('/api/log', (req, res) => {
  if (!req.session.userId) {
    const test = users.find(t => t.login === req.body.id && t.password === req.body.password)
    if (!test) {
      res.error(404)
      res.json({
        message: 'error'
      })
    } else {
      req.session.userId = 1000
      res.json({
        message: 'connected',
        todoList: test.todoList
      })
    }
  } else {
    res.error(404)
    res.json({
      message: 'you are already connected'
    })
  }
})

app.post('/api/logout', (req, res) => {
  if (!req.session.userId) {
    res.error(404)
    res.json({
      message: 'you are already disconnected'
    })
  } else {
    req.session.userId = 0
    res.json({
      message: 'you are now disconnected'
    })
  }
})

app.post('/api/newLog', (req, res) => {
  const test = users.find(t => t.login === req.body.id && t.password === req.body.password)
  if (!test) {
    users.push({
      login: req.body.id,
      password: req.body.password,
      todoList: []
    })
    req.json({
      message: 'Created'
    })
  } else {
    res.error(404)
    res.json({
      message: 'Already create'
    })
  }
})

app.post('/api/refreshTodo', (req, res) => {
  const test = users.find(t => t.login === req.body.id && t.password === req.body.password)
  test.todoList = req.body.todoList
  res.json({
    message: 'Todo saved successful'
  })
})

app.get('/api/admin', (req, res) => {
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }

  res.json({
    message: 'congrats, you are connected'
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
