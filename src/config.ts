import dotenv from 'dotenv'

export interface Config {
  name: string
}

export function loadConfig(): Config {
  // Load environment variables
  const { parsed } = dotenv.config()

  if (!parsed) {
    throw new Error('Failed to load environment variables')
  }

  // Required environment variables
  const requiredVariables = ['NAME']
  requiredVariables.forEach((environmentVariable) => {
    if (!parsed[environmentVariable]) {
      console.error(
        `Missing required environment variable: ${environmentVariable}`,
      )
      process.exit(1)
    }
  })

  return {
    name: parsed.NAME || '',
  }
}

export default loadConfig()
