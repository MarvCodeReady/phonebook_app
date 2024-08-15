const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')


app.use(express.json())
app.use(express.static("dist"))
app.use(morgan('tiny'))
app.use(cors())

morgan.token('req-body', (request) => {
    if(request.method === "POST"){
        return JSON.stringify(request.body);
    }
    return "";
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

const errorHandler = (error, request, response, next) => {
    console.error(error.messsage)

    if(error.name === 'CastError'){
        return response.status(400).send({error : 'malformated id'})
    }
    next(error)
}

let persons =  [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      },
      {
        "name": "Marcus Arelius",
        "number": "555-444-8888",
        "id": "5"
      },
      {
        "name": "Bob Green",
        "number": "329-496-7721",
        "id": "6"
      },
      {
        "name": "Greg Freeman",
        "number": "237-584-1789",
        "id": "7"
      },
      {
        "name": "Sally Mendes",
        "number": "390-719-8932",
        "id": "8"
      },
      {
        "name": "Pami Wonder",
        "number": "230-324-1275",
        "id": "9"
      }
    ]


  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
  })

  app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(count => {
            response.send(`<h1>Phonebook has info for ${count} people</h1> 
                    <br/>
                    <h1>${Date()}</h1>`)
        })
        .catch(error => {
            console.error('Error counting the number of people', error)
            response.status(500).send('An error has occurred while retrieving the information')
        })
    
    console.log(persons.length)
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

    response.status(204).end()
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    response .status(204).end()
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error : 'name and or number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

  })

  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})