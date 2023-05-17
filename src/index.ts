import './common/initializer'
import express from 'express'
import getEnvVar from './common/getEnvVar'

const app = express()

const port = getEnvVar<number>('PORT')

app.get('/', (req, res) => {
  res.send(JSON.stringify({ message: 'Hello World!' }))
})

app.post('/sign_up', (req, res) => {
  res.send(JSON.stringify({ message: 'Sign up' }))
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`)
})
