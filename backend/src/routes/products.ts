import { Router } from 'express'
import db from '../db'

const router = Router()

const toAssetUrl = (req: any, assetPath: string) => {
  if (/^https?:\/\//i.test(assetPath)) return assetPath

  return `${req.protocol}://${req.get('host')}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`
}

router.get('/', (req, res) => {
  const steps = db.prepare('SELECT * FROM steps ORDER BY order_num').all()

  const result = steps.map((step: any) => {
    const products = db.prepare('SELECT * FROM products WHERE step_id = ?').all(step.id)

    const productsWithVariants = products.map((product: any) => {
      const variants = db
        .prepare('SELECT id, label, swatch, price FROM variants WHERE product_id = ?')
        .all(product.id)

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: toAssetUrl(req, product.image),
        badge: product.badge_text
          ? { text: product.badge_text, color: product.badge_color }
          : undefined,
        hasVariants: !!product.has_variants,
        variants,
        price: product.price,
        compareAtPrice: product.compare_at_price,
        category: product.category,
      }
    })

    return {
      id: step.id,
      title: step.title,
      icon: toAssetUrl(req, step.icon),
      products: productsWithVariants,
    }
  })

  res.json({ steps: result })
})

export default router
