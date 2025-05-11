import { loadConfig } from './config.js'
import { formatGreeting } from './utils.js'

async function main() {
  const config = loadConfig()
  console.log(formatGreeting(config.name))
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
