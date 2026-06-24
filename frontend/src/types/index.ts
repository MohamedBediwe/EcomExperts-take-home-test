// ─── Product & Variant ─────────────────────────────────────────────

export interface Variant {
  id: string
  label: string
  swatch: string
  price?: number
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  badge?: {
    text: string
    color: string
  }
  hasVariants: boolean
  variants: Variant[]
  price: number
  compareAtPrice?: number
  category: string
}

// ─── Step ──────────────────────────────────────────────────────────

export interface StepData {
  id: number
  title: string
  icon: string
  products: Product[]
}

// ─── Cart ───────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  variantId?: string
  quantity: number
}

export interface CartState {
  [stepId: number]: CartItem[]
}

// ─── Review Panel ──────────────────────────────────────────────────

export interface ReviewItem {
  productId: string
  name: string
  image: string
  variantLabel?: string
  quantity: number
  price: number
  total: number
  category: string
}