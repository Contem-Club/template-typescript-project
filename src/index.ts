import { loadConfig } from './config.js'

async function main() {
  const config = loadConfig()
  console.log(`Hello, ${config.name}`)
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
