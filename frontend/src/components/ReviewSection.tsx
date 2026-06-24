import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import type { ReviewItem, CartItem } from '../types'
import fastShipping from "../assets/fast-shipping.png"
import CheckoutModal from './CheckoutModal'
import SatisfactionComponent from './SatisfactionComponent'
import PricesComponent from './PricesComponent'
import CheckoutButton from './CheckoutButton'
import SaveForLaterButton from './SaveForLaterButton'
import QuantityStepper from './QuantityStepper'

interface ReviewLineItem extends ReviewItem {
  variantId?: string
  stepId: number
  compareAtPrice?: number
}

const SHIPPING_COST = 5.99

export default function ReviewSection() {
  const cart = useStore((state) => state.cart)
  const steps = useStore((state) => state.steps)
  const updateQuantity = useStore((state) => state.updateQuantity)
  const clearCart = useStore((state) => state.clearCart)
  const saveForLater = useStore((state) => state.saveForLater)
  const [saveMessage, setSaveMessage] = useState('')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const { reviewItems, subtotal, totalSavings, finalTotal, grouped } = useMemo(() => {
    if (!steps) {
      return { reviewItems: [], subtotal: 0, totalSavings: 0, finalTotal: 0, grouped: {} }
    }

    const items: ReviewLineItem[] = []
    let sub = 0
    let savings = 0

    Object.entries(cart).forEach(([stepIdStr, stepItems]) => {
      const stepId = Number(stepIdStr)

      stepItems.forEach((item: CartItem) => {
        let product = null
        for (const step of steps) {
          product = step.products.find((p) => p.id === item.productId)
          if (product) break
        }
        if (!product) return

        const variant = item.variantId
          ? product.variants.find((v) => v.id === item.variantId)
          : undefined

        const price = variant?.price ?? product.price
        const total = price * item.quantity
        const itemCompareAtPrice = product.compareAtPrice
          ? product.compareAtPrice * item.quantity
          : undefined

        items.push({
          productId: item.productId,
          name: product.name,
          image: product.image,
          variantLabel: variant?.label,
          variantId: item.variantId,
          stepId: stepId,
          quantity: item.quantity,
          price,
          total,
          category: product.category,
          compareAtPrice: itemCompareAtPrice,
        })

        sub += total
        if (product.compareAtPrice) {
          savings += (product.compareAtPrice - price) * item.quantity
        }

      })
    })

    // Add free shipping discount to total savings
    const hasItems = items.length > 0
    if (hasItems) {
      savings += SHIPPING_COST
    }

    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, ReviewLineItem[]>)

    return {
      reviewItems: items,
      subtotal: sub,
      totalSavings: savings,
      finalTotal: sub,
      grouped,
    }
  }, [cart, steps])

  const categories = ['cameras', 'sensors', 'accessories', 'plan']

  const handleQuantityChange = (item: ReviewLineItem, delta: number) => {
    updateQuantity(item.stepId, item.productId, item.variantId, delta)
  }

  const handleCheckout = () => {
    setShowCheckoutModal(true)
  }

  const confirmCheckout = () => {
    clearCart()
    setShowCheckoutModal(false)
  }

  const handleSaveForLater = () => {
    saveForLater()
    setSaveMessage('System saved!')
    setTimeout(() => setSaveMessage(''), 5000)
  }

  if (reviewItems.length === 0) {
    return (
      <div className="bg-[#F5F7FA] rounded-2xl p-4 sm:p-6 text-center">
        <p className="text-gray-500">Your cart is empty</p>
        <p className="text-xs text-gray-400 mt-2">Add items to build your security system</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#F5F7FA] rounded-2xl p-4 sm:p-6">
        <div className='flex justify-between flex-col xl:flex-row gap-4'>

          <div className='flex-1'>
            <p className="uppercase text-[10px] text-[#484848] tracking-widest mb-4">review</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-1">Your security system</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 border-b border-b-[#CED6DE] pb-4">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
            {categories.map(
            (cat) =>
              grouped[cat] && (
              <div key={cat} className="mb-4 border-b border-b-[#CED6DE]">
                <p className="uppercase text-[10px] text-[#484848] tracking-widest mb-2">{cat}</p>
                {grouped[cat].map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    className="flex items-center gap-3 py-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F1F1F] truncate">
                        {item.name}
                        {item.variantLabel && (
                          <span className="text-gray-400"> ({item.variantLabel})</span>
                        )}
                      </p>
                    </div>
                    {item.category !== 'plan' && (
                      <QuantityStepper
                        quantity={item.quantity}
                        onDecrease={() => handleQuantityChange(item, -1)}
                        onIncrease={() => handleQuantityChange(item, 1)}
                      />
                    )}
                    <div className="text-right min-w-[60px]">
                      {item.compareAtPrice && item.compareAtPrice > item.total && (
                        <p className="text-xs text-gray-400 line-through">
                          ${item.compareAtPrice.toFixed(2)}
                        </p>
                      )}
                      <p className="text-sm font-bold text-[#4E2FD2]">
                        {item.total === 0 ? "FREE" : `$${item.total.toFixed(2)}`}
                        {item.category === 'plan' && <span className="text-xs">/mo</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <img src={fastShipping} alt='fast shipping' />
            <span className="text-sm text-[#0B0D10]">Fast Shipping</span>
            <span className="ml-auto text-sm text-gray-400 line-through">${SHIPPING_COST.toFixed(2)}</span>
            <span className="text-sm font-bold text-[#6B4CFF]">FREE</span>
          </div>
        </div>
          </div>
          <div>
              <div className='flex justify-between'>
                <SatisfactionComponent />
                <PricesComponent subtotal={subtotal} totalSavings={totalSavings}  finalTotal={finalTotal} className="flex lg:hidden" />
              </div>
              <PricesComponent subtotal={subtotal} totalSavings={totalSavings}  finalTotal={finalTotal} className="hidden lg:flex" />

              {totalSavings > 0 && (
                <p className="text-center text-xs sm:text-sm text-[#0AA288] mt-2 font-medium">
                  Congrats! You're saving ${totalSavings.toFixed(2)} on your security bundle!
                </p>
               )}
               <CheckoutButton handleCheckout={handleCheckout} />
        <SaveForLaterButton handleSaveForLater={handleSaveForLater} />

            {saveMessage && (
              <p className="text-center text-xs text-[#6B4CFF] mt-2 bg-[#6B4CFF]/10 rounded py-1">
                {saveMessage}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal confirmCheckout={confirmCheckout} />
      )}
    </>
  )
}