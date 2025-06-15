// src/index.js

// src/index.js
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import notionRoutes from './routes/notion.route.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import boardRoutes from './routes/board.route.js'
import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'

// ========================
// 🔍 基本設定
// ========================
const PORT = process.env.PORT ?? 5001
const __dirname = path.resolve()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

// ========================
// 🔧 CORS 設定
// ========================
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,                // .env 優先
  'https://ichibanboshi-sample.onrender.com' // 本番 URL 直書きフォールバック
].filter(Boolean)

app.use(cors({
  origin (origin, callback) {
    if (!origin) return callback(null, true)          // curl など無 Origin 許可
    if (allowedOrigins.includes(origin)) return callback(null, true)
    console.log(`❌ CORS blocked: ${origin}`)
    return callback(new Error('Not allowed by CORS'), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-client-fingerprint'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}))

app.options('*', (_, res) => res.sendStatus(200)) // プリフライト

// ========================
// 📦 静的ファイル配信 (本番)
// ========================
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(process.cwd(), 'frontend/dist')
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath))
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' })
      }
      res.sendFile(path.join(staticPath, 'index.html'))
    })
    console.log('✅ Serving static files from', staticPath)
  } else {
    console.log('❌ Static path not found', staticPath)
  }
}

// ========================
// 🔗 API ルーティング
// ========================
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/notion', notionRoutes)

// ========================
// 🚀 サーバ起動
// ========================
server.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`)
  connectDB().then(() => console.log('Database is connected'))
})
