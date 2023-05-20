import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import getEnvVar from './getEnvVar'

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({ region: 'ap-northeast-1' })

const poolData = {
  ClientId: getEnvVar<string>('USER_POOL_CLIENT_ID'),
  UserPoolId: getEnvVar<string>('USER_POOL_ID')
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

export { userPool, cognitoidentityserviceprovider }
