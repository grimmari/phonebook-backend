require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Person = require('./models/person')


app.use(express.static('build'))
app.use(bodyParser.json())

//morgan logger
morgan.token('body', (req, ) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//morgan(':method :url :status :res[content-length] - :response-time ms')



//GET ALL
app.get('/api/persons', (req, response) => {
  Person.find({}).then(person => {
    console.log(person)
    response.json(person)
  })
})
//GET BY ID
app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})



//ADD
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,

  })
  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(saveAndFormattedPerson => {
      response.json(saveAndFormattedPerson)
    })
    .catch(error => next(error))


})
//UPDATE
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

//DELETE
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})


app.get('/', (req, res) => {

  res.send('<h1>Hello world</h1>')
})
app.get('/info', (req, res) => {

  let message = 'Phonebook has info for ' + Person.length + ' people'
  let today = new Date()
  let date = today.toUTCString()
  res.send('<p>' + message + '</p><p>' + date + '</>')
})
const errorHandler = (error, request, response, next) => {
  console.error('Error', error)
  console.error('Error', error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    console.log('CastError')
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('ValidationError')
    return response.status(409).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})