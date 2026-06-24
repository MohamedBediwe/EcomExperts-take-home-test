import { create } from 'zustand'
import type { StepData, CartState, CartItem, ReviewItem } from '../types'

interface Store {
  steps: StepData[] | null
  isLoading: boolean
  error: string | null
  activeStep: number
  selectedVariants: { [productId: string]: string }
  cart: CartState
  setSteps: (steps: StepData[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setActiveStep: (step: number) => void
  goToNextStep: () => void
  setSelectedVariant: (productId: string, variantId: string) => void
  updateQuantity: (stepId: number, productId: string, variantId: string | undefined, delta: number) => void
  setQuantity: (stepId: number, productId: string, variantId: string | undefined, quantity: number) => void
  clearCart: () => void
  saveForLater: () => void
  loadSavedSession: () => boolean
  getSelectedCount: (stepId: number) => number
  getStepItems: (stepId: number) => CartItem[]
  getProductQuantity: (stepId: number, productId: string, variantId?: string) => number
  isProductSelected: (stepId: number, productId: string) => boolean
  getSelectedVariant: (productId: string) => string | undefined
  getCartForReview: () => ReviewItem[]
  getSubtotal: () => number
  getTotalSavings: () => number
  getShippingCost: () => number
  getFinalTotal: () => number
}

const findProduct = (steps: StepData[] | null, productId: string) => {
  if (!steps) return undefined
  for (const step of steps) {
    const product = step.products.find(p => p.id === productId)
    if (product) return product
  }
  return undefined
}

const getDefaultSelectedVariants = (
  steps: StepData[],
  cart: CartState,
  selectedVariants: Store['selectedVariants'] = {}
) => {
  const nextSelectedVariants = { ...selectedVariants }

  steps.forEach((step) => {
    step.products.forEach((product) => {
      if (!product.hasVariants || product.variants.length === 0 || nextSelectedVariants[product.id]) {
        return
      }

      const cartVariant = (cart[step.id] || []).find(
        (item) => item.productId === product.id && item.variantId
      )?.variantId

      nextSelectedVariants[product.id] = cartVariant || product.variants[0].id
    })
  })

  return nextSelectedVariants
}

const initialCart: CartState = {
  1: [],
  2: [],
  3: [
    { productId: 'sense-hub', quantity: 1 },
  ],
  4: [],
}

const SAVED_CART_KEY = 'wyze_saved_cart'

const loadSavedCartFromStorage = () => {
  const stored = localStorage.getItem(SAVED_CART_KEY)
  if (!stored) return null
  try {
    const data = JSON.parse(stored)
    return {
      cart: data.cart || {},
      selectedVariants: data.selectedVariants || {},
      activeStep: data.activeStep || 1,
    }
  } catch {
    return null
  }
}

const savedState = loadSavedCartFromStorage()

export const useStore = create<Store>()((set, get) => ({
  steps: null,
  isLoading: false,
  error: null,
  activeStep: savedState?.activeStep ?? 1,
  selectedVariants: savedState?.selectedVariants ?? {},
  cart: savedState?.cart ?? initialCart,

  setSteps: (steps) =>
    set((state) => ({
      steps,
      selectedVariants: getDefaultSelectedVariants(steps, state.cart, state.selectedVariants),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActiveStep: (step) => set({ activeStep: step }),

  goToNextStep: () => {
    const { activeStep } = get()
    if (activeStep < 4) set({ activeStep: activeStep + 1 })
  },

  setSelectedVariant: (productId, variantId) =>
    set((state) => ({
      selectedVariants: { ...state.selectedVariants, [productId]: variantId },
    })),

  updateQuantity: (stepId, productId, variantId, delta) => {
    set((state) => {
      const stepItems = [...(state.cart[stepId] || [])]
      const itemIndex = stepItems.findIndex(
        (i) => i.productId === productId && i.variantId === variantId
      )

      if (itemIndex >= 0) {
        const newQty = stepItems[itemIndex].quantity + delta
        if (newQty <= 0) {
          stepItems.splice(itemIndex, 1)
        } else {
          stepItems[itemIndex] = { ...stepItems[itemIndex], quantity: newQty }
        }
      } else if (delta > 0) {
        stepItems.push({ productId, variantId, quantity: delta })
      }

      return { cart: { ...state.cart, [stepId]: stepItems } }
    })
  },

  setQuantity: (stepId, productId, variantId, quantity) => {
    if (quantity <= 0) {
      set((state) => {
        const stepItems = (state.cart[stepId] || []).filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
        return { cart: { ...state.cart, [stepId]: stepItems } }
      })
    } else {
      set((state) => {
        const stepItems = [...(state.cart[stepId] || [])]
        const itemIndex = stepItems.findIndex(
          (i) => i.productId === productId && i.variantId === variantId
        )

        if (itemIndex >= 0) {
          stepItems[itemIndex] = { ...stepItems[itemIndex], quantity }
        } else {
          stepItems.push({ productId, variantId, quantity })
        }

        return { cart: { ...state.cart, [stepId]: stepItems } }
      })
    }
  },

  clearCart: () => set({ cart: {}, selectedVariants: {}, activeStep: 1 }),

  saveForLater: () => {
    const state = get()
    const sessionData = {
      cart: state.cart,
      selectedVariants: state.selectedVariants,
      activeStep: state.activeStep,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(SAVED_CART_KEY, JSON.stringify(sessionData))
  },

  loadSavedSession: () => {
    const stored = localStorage.getItem(SAVED_CART_KEY)
    if (!stored) return false
    try {
      const data = JSON.parse(stored)
      set({
        cart: data.cart || {},
        selectedVariants: data.selectedVariants || {},
        activeStep: data.activeStep || 1,
      })
      return true
    } catch {
      return false
    }
  },

  getSelectedCount: (stepId) => {
    const stepItems = get().cart[stepId] || []
    const uniqueProductIds = new Set(stepItems.map(i => i.productId))
    return uniqueProductIds.size
  },

  getStepItems: (stepId) => get().cart[stepId] || [],

  getProductQuantity: (stepId, productId, variantId) => {
    const item = (get().cart[stepId] || []).find(
      (i) => i.productId === productId && i.variantId === variantId
    )
    return item?.quantity || 0
  },

  isProductSelected: (stepId, productId) =>
    (get().cart[stepId] || []).some((i) => i.productId === productId),

  getSelectedVariant: (productId) => {
    const state = get()
    if (state.selectedVariants[productId]) return state.selectedVariants[productId]

    const step = state.steps?.find((s) => s.products.some((p) => p.id === productId))
    const product = step?.products.find((p) => p.id === productId)
    if (!step || !product?.hasVariants || !product.variants.length) return undefined

    const selectedCartVariant = (state.cart[step.id] || []).find(
      (item) => item.productId === productId && item.variantId
    )?.variantId

    return selectedCartVariant || product.variants[0].id
  },

  getCartForReview: () => {
    const { cart, steps } = get()
    const reviewItems: ReviewItem[] = []

    Object.values(cart).forEach((items: CartItem[]) => {
      items.forEach((item: CartItem) => {
        const product = findProduct(steps, item.productId)
        if (!product) return

        const variant = item.variantId
          ? product.variants.find((v) => v.id === item.variantId)
          : undefined

        const price = variant?.price ?? product.price

        reviewItems.push({
          productId: item.productId,
          name: product.name,
          image: product.image,
          variantLabel: variant?.label,
          quantity: item.quantity,
          price: price,
          total: price * item.quantity,
          category: product.category,
        })
      })
    })

    return reviewItems
  },

  getSubtotal: () => get().getCartForReview().reduce((sum, item) => sum + item.total, 0),

  getTotalSavings: () => {
    const { cart, steps } = get()
    let savings = 0

    Object.values(cart).forEach((items: CartItem[]) => {
      items.forEach((item: CartItem) => {
        const product = findProduct(steps, item.productId)
        if (!product || !product.compareAtPrice) return

        const variant = item.variantId
          ? product.variants.find((v) => v.id === item.variantId)
          : undefined

        const currentPrice = variant?.price ?? product.price
        savings += (product.compareAtPrice - currentPrice) * item.quantity
      })
    })

    return savings
  },

  getShippingCost: () => (get().getSubtotal() > 0 ? 0 : 5.99),

  getFinalTotal: () => get().getSubtotal() + get().getShippingCost(),
}))