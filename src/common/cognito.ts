import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import getEnvVar from './getEnvVar'

const poolData = {
  ClientId: getEnvVar<string>('USER_POOL_CLIENT_ID'),
  UserPoolId: getEnvVar<string>('USER_POOL_ID'),
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

export { userPool }
