const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://grimmari-atlas:${password}@cluster0-1actz.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
if (process.argv.length === 3) {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,

  })
  console.log('phonebook:')
  const Person = mongoose.model('Person', personSchema)
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,

  })

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(response => {

    console.log(`added ${response.name} number ${response.number}`)
    mongoose.connection.close()
  })
}


