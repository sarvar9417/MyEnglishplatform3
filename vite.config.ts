import { defineConfig } from 'vitest/config'
import type { ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'
import 'dotenv/config'  // .env ni process.env ga yuklaydi (dev proxy uchun)
import viteCompression from 'vite-plugin-compression'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || ''

// Vite dev serverda Anthropic API proxisi — API kalit serverda qoladi
function anthropicProxyPlugin() {
  return {
    name: 'anthropic-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/claude', async (req: IncomingMessage, res: ServerResponse, _next: Function) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Anthropic API kaliti sozlanmagan. .env faylida ANTHROPIC_API_KEY ni belgilang.' }))
          return
        }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            const model = parsed.model || process.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-5'

            const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
              },
              body: JSON.stringify({ model, ...parsed }),
            })

            if (!parsed.stream) {
              const data = await anthropicRes.json()
              res.statusCode = anthropicRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return
            }

            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.statusCode = 200

            if (!anthropicRes.body) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'No response body from Anthropic API' }))
              return
            }
            const reader = anthropicRes.body.getReader()
            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(decoder.decode(value))
            }
            res.end()
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    anthropicProxyPlugin(),
    viteCompression({ algorithm: 'gzip', threshold: 10240 }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Vendor chunks (node_modules)
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('recharts')) return 'charts'
            if (id.includes('dexie'))   return 'db'
            if (id.includes('lucide-react')) return 'icons'
            return 'vendor'
          }

          // Lesson data chunks (lazy loaded via loadAllLessons)
          if (id.includes('/src/data/dailyLessons') ||
              id.includes('/src/data/tenses/') ||
              id.includes('/src/data/daily/lessonsA2') ||
              id.includes('/src/data/daily/a2Part')) {
            return 'lessons-a1-a2'
          }
          if (id.includes('/src/data/daily/lessonsB1') ||
              id.includes('/src/data/daily/b1Part1') ||
              id.includes('/src/data/b1DailyLessons')) {
            return 'lessons-b1'
          }
          if (id.includes('/src/data/daily/lessonsB1plus') ||
              id.includes('/src/data/daily/b1plusPart') ||
              id.includes('/src/data/b1plusDailyLessons')) {
            return 'lessons-b1plus'
          }
          if (id.includes('/src/data/daily/lessonsB2') ||
              id.includes('/src/data/daily/b2Part') ||
              id.includes('/src/data/b2DailyLessons')) {
            return 'lessons-b2'
          }
          if (id.includes('/src/data/daily/reviewLessons')) {
            return 'lessons-reviews'
          }
          if (id.includes('/src/data/lessonSkillsContent') ||
              id.includes('/src/data/listeningLessons')) {
            return 'lessons-skills'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 20,
        functions: 20,
        branches: 20,
      },
      include: ['src/services/**', 'src/store/**', 'src/lib/**'],
      exclude: ['src/data/**', 'src/**/*.test.ts', 'src/lib/monitoring.ts'],
    },
  },
})
