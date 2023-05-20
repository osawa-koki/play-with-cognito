import './common/initializer'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import express from 'express'
import getEnvVar from './common/getEnvVar'
import { cognitoidentityserviceprovider, userPool } from './common/cognito'
import type SignUpStruct from './interface/sign_up_struct'
import getJwtToken from './common/getJwtToken'
import areAllNonEmptyStrings from './common/areAllNonEmptyStrings'
import makeCognitoUserAttributes from './common/makeCognitoUserAttributes'

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

  if (areAllNonEmptyStrings(name, email, password) === false) {
    res.status(400).send(JSON.stringify({
      message: 'Invalid JSON property.'
    }))
    return
  }

  const attributeList = makeCognitoUserAttributes({
    name,
    email
  })

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
          error: err?.message
        }))
        return
      }

      // 登録が成功した場合の処理
      if (result !== undefined) {
        const cognitoUser = result.user
        res.send(JSON.stringify({
          message: 'Success',
          cognitoUser
        }))
      } else {
        res.status(500).send(JSON.stringify({
          message: 'Internal Server Error',
          error: 'result is undefined'
        }))
      }
    }
  )
})

app.post('/verify_code', (req, res) => {
  const email = req.body.email
  const code = req.body.code

  const userData = {
    Username: email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.confirmRegistration(code, true, (err, result) => {
    // 確認がエラーとなった場合の処理
    if (err !== null) {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: err?.message
      }))
      return
    }

    // 確認が成功した場合の処理
    if (result !== undefined) {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    } else {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: 'result is undefined'
      }))
    }
  })
})

app.post('/sign_in', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password
  })

  const userData = {
    Username: email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: result => {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    },
    onFailure: err => {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: err?.message
      }))
    }
  })
})

app.get('/verify_jwt', (req, res) => {
  const accessToken = getJwtToken(req)
  if (accessToken === null) {
    res.status(400).send(JSON.stringify({
      message: 'Invalid Authorization header.'
    }))
    return
  }

  cognitoidentityserviceprovider.getUser({
    AccessToken: accessToken
  }, (err, result) => {
    // ユーザー情報の取得がエラーとなった場合の処理
    if (err !== null) {
      res.status(402).send(JSON.stringify({
        message: 'Invalid Access Token.',
        error: err?.message
      }))
      return
    }

    // ユーザー情報の取得が成功した場合の処理
    if (result !== undefined) {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    } else {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: 'result is undefined'
      }))
    }
  })
})

app.delete('/sign_out', (req, res) => {
  const accessToken = getJwtToken(req)
  if (accessToken === null) {
    res.status(400).send(JSON.stringify({
      message: 'Invalid Authorization header.'
    }))
    return
  }

  cognitoidentityserviceprovider.globalSignOut({
    AccessToken: accessToken
  }, (err, result) => {
    // サインアウトがエラーとなった場合の処理
    if (err !== null) {
      res.status(403).send(JSON.stringify({
        message: 'Invalid Access Token.',
        error: err?.message
      }))
      return
    }

    // サインアウトが成功した場合の処理
    if (result !== undefined) {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    } else {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: 'result is undefined'
      }))
    }
  })
})

app.put('/change_password', (req, res) => {
  const email = req.body.email
  const oldPassword = req.body.old_password
  const newPassword = req.body.new_password

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: oldPassword
  })

  const userData = {
    Username: email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: _result => {
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        // パスワード変更がエラーとなった場合の処理
        if (err !== null) {
          res.status(500).send(JSON.stringify({
            message: 'Internal Server Error',
            error: err?.message
          }))
          return
        }

        // パスワード変更が成功した場合の処理
        if (result !== undefined) {
          res.send(JSON.stringify({
            message: 'Success',
            result
          }))
        } else {
          res.status(500).send(JSON.stringify({
            message: 'Internal Server Error',
            error: 'result is undefined'
          }))
        }
      })
    },
    onFailure: err => {
      res.status(400).send(JSON.stringify({
        message: 'Failed to change password.',
        error: err?.message
      }))
    }
  })
})

app.put('/reset_password', (req, res) => {
  const email = req.body.email

  const userData = {
    Username: email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.forgotPassword({
    onSuccess: result => {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    },
    onFailure: err => {
      res.status(400).send(JSON.stringify({
        message: 'Failed to reset password.',
        error: err?.message
      }))
    }
  })
})

app.put('/confirm_password', (req, res) => {
  const email = req.body.email
  const verificationCode = req.body.verification_code
  const newPassword = req.body.new_password

  const userData = {
    Username: email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess: result => {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    },
    onFailure: err => {
      res.status(400).send(JSON.stringify({
        message: 'Failed to confirm password.',
        error: err?.message
      }))
    }
  })
})

app.put('/update_attributes', (req, res) => {
  const accessToken = getJwtToken(req)
  if (accessToken === null) {
    res.status(400).send(JSON.stringify({
      message: 'Invalid Authorization header.'
    }))
    return
  }

  const comment = req.body.comment

  const attributes = []
  if (comment !== undefined) {
    attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'custom:comment',
      Value: comment
    }))
  }

  cognitoidentityserviceprovider.updateUserAttributes({
    AccessToken: accessToken,
    UserAttributes: attributes
  }, (err, result) => {
    // ユーザー属性の更新がエラーとなった場合の処理
    if (err !== null) {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: err?.message
      }))
      return
    }

    // ユーザー属性の更新が成功した場合の処理
    if (result !== undefined) {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    } else {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: 'result is undefined'
      }))
    }
  })
})

app.delete('/withdrawal', (req, res) => {
  const accessToken = getJwtToken(req)
  if (accessToken === null) {
    res.status(400).send(JSON.stringify({
      message: 'Invalid Authorization header.'
    }))
    return
  }

  cognitoidentityserviceprovider.deleteUser({
    AccessToken: accessToken
  }, (err, result) => {
    // ユーザーの削除がエラーとなった場合の処理
    if (err !== null) {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: err?.message
      }))
      return
    }

    // ユーザーの削除が成功した場合の処理
    if (result !== undefined) {
      res.send(JSON.stringify({
        message: 'Success',
        result
      }))
    } else {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: 'result is undefined'
      }))
    }
  })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`)
})
