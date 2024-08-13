const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('req-body', (request) => {
    if(request.method === "POST"){
        return JSON.stringify(request.body);
    }
    return "";
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

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
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else {
        response.status(404).end
    }

  })

  app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${persons.length} people</h1> 
                    <br/>
                    <h1>${Date()}</h1>`  )
    console.log(persons.length)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })

  const generateID = () => {
    const maxId = persons.length > 0 ?
        Math.floor(Math.random() * 1000)
        : 0
        return String(maxId + 1)
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error : 'name and or number is missing'
        })
    }

    const nameExists = persons.some((person) => 
                    person.name.toLowerCase() === body.name.toLowerCase())

    if(nameExists){
        return response.status(400).json({
            error : 'name must be unique'
        })
    }


    const person = {
        name: body.name,
        number: body.number,
        id : generateID(),
    }

    persons = persons.concat(person)
    response.json(person)

  })

  const PORT = 3001
  app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})