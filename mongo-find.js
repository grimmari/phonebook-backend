const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://grimmari-atlas:${password}@cluster0-1actz.mongodb.net/phonebook-app?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Date,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)
Person.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})