import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { runPythonCode } = require('./electron/pythonRunner.cjs')

function pythonRunnerPlugin(): Plugin {
  return {
    name: 'python-dev-runner',
    configureServer(server) {
      server.middlewares.use('/api/run-python', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const { code, problemId } = JSON.parse(body || '{}')
              const result = await runPythonCode(code, problemId)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(result))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err?.message || 'Execution error' }))
            }
          })
        } else {
          res.statusCode = 405
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pythonRunnerPlugin()],
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
})
