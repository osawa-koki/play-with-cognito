import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'

export default function makeCognitoUserAttribute (kvp: Record<string, string>): AmazonCognitoIdentity.CognitoUserAttribute[] {
  return Object.entries(kvp).map(([key, value]) => new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: key,
    Value: value
  }))
}
