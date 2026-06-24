import express from 'express'
import cors from 'cors'
import path from 'path'
import productRoutes from './routes/products'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, '..', 'images')))
app.use('/icons', express.static(path.join(__dirname, '..', 'icons')))

app.use('/api/products', productRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
