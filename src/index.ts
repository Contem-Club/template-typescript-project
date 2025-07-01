import { Server } from './backend/server.js'

try {
  const server = new Server()
  server.start()
} catch (error) {
  console.error('Failed to start server:', error)
  process.exit(1)
}
