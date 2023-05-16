import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send(JSON.stringify({ message: 'Hello World!' }))
})
