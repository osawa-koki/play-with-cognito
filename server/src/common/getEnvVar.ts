
function getEnvVar<T> (name: string): T {
  const value = process.env[name]
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined.`)
  }
  try {
    return value as T
  } catch (error) {
    throw new Error(`Environment variable ${name} is not of type ${typeof value}.`)
  }
}

export default getEnvVar
