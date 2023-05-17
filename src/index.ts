import './common/initializer'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import express from 'express'
import getEnvVar from './common/getEnvVar'
import { userPool } from './common/cognito'
import type SignUpStruct from './interface/sign_up_struct'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

const port = getEnvVar<number>('PORT')

app.get('/', (req, res) => {
  res.send(JSON.stringify({ message: 'Hello World!' }))
})

app.post('/sign_up', (req, res) => {
  const body: SignUpStruct = req.body
  const name = body.name
  const email = body.email
  const password = body.password

  if (name === '' || email === '' || password === '') {
    res.status(400).send(JSON.stringify({
      message: 'Invalid JSON property.',
    }))
    return
  }

  const attributeList = []
  const attributeName = new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: 'name',
    Value: name,
  })
  attributeList.push(attributeName)
  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: 'email',
    Value: email,
  })
  attributeList.push(attributeEmail)

  userPool.signUp(
    email,
    password,
    attributeList,
    attributeList,
    (err, result) => {
      // 登録がエラーとなった場合の処理
      if (err !== null) {
        res.status(500).send(JSON.stringify({
          message: 'Internal Server Error',
          error: err?.message,
        }))
        return
      }

      // 登録が成功した場合の処理
      if (result !== undefined) {
        const cognitoUser = result.user
        res.send(JSON.stringify({
          message: 'Success',
          cognitoUser,
        }))
      } else {
        res.status(500).send(JSON.stringify({
          message: 'Internal Server Error',
          error: 'result is undefined',
        }))
      }
    }
  )
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`)
})
