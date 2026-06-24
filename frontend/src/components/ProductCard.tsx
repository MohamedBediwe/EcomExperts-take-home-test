import { memo } from 'react'
import { useStore } from '../store/useStore'
import type { Product } from '../types'
import QuantityStepper from './QuantityStepper'

interface ProductCardProps {
  product: Product
  stepId: number
}

function ProductCard({ product, stepId }: ProductCardProps) {
  const selectedVariantId = useStore((state) => state.getSelectedVariant(product.id))
  const setSelectedVariant = useStore((state) => state.setSelectedVariant)
  const updateQuantity = useStore((state) => state.updateQuantity)
  const setQuantity = useStore((state) => state.setQuantity)
  const quantity = useStore((state) =>
    state.getProductQuantity(stepId, product.id, selectedVariantId)
  )
  const isSelected = useStore((state) => state.isProductSelected(stepId, product.id))

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId)
  const displayPrice = currentVariant?.price ?? product.price
  const isPlan = product.category === 'plan'

  const handleVariantClick = (variantId: string) => {
    setSelectedVariant(product.id, variantId)
  }

  const handleDecrease = () => {
    updateQuantity(stepId, product.id, selectedVariantId, -1)
  }

  const handleIncrease = () => {
    updateQuantity(stepId, product.id, selectedVariantId, 1)
  }

  if (isPlan) {
    return (
      <button
        type="button"
        onClick={() => setQuantity(stepId, product.id, undefined, isSelected ? 0 : 1)}
        className={`w-full px-3 py-4 text-left transition-all bg-white`}
      >
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.08em]">
          Home Monitoring Plan
        </p>
        <div className="flex items-center gap-4">
          <img src={product.image} alt="" className="h-5 w-5 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#4E2FD2]">{product.name}</p>
          </div>
          <div className="text-right">
            {product.compareAtPrice && (
              <p className="text-xs font-bold text-[#7B7B7B] line-through">
                ${product.compareAtPrice.toFixed(2)}/mo
              </p>
            )}
            <p className="text-xs font-bold text-[#4E2FD2]">${displayPrice.toFixed(2)}/mo</p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div
      className={`relative rounded-xl p-3 sm:p-4 transition-all bg-white ${isSelected && "border-[#4E2FD2B2]"} md:w-[360px] lg:w-[220px]`}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-white"
          style={{ backgroundColor: product.badge.color }}
        >
          {product.badge.text}
        </span>
      )}

      {/* Image */}
      <div className="flex justify-center py-3 sm:py-4">
        <img src={product.image} alt={product.name} className="h-24 sm:h-32 object-contain" />
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-sm sm:text-base text-[#1F1F1F]">{product.name}</h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
      <a href="#" className="text-xs sm:text-sm text-[#6B4CFF] underline mt-1 inline-block">
        Learn More
      </a>

      {/* Variant Selector */}
      {product.hasVariants && product.variants.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleVariantClick(variant.id)}
              className={`flex items-center justify-center gap-1 px-2 py-1 rounded-xs border text-[10px] sm:text-xs transition-all w-[65px] ${
                selectedVariantId === variant.id
                  ? 'border-[#0AA288] bg-[#F8F6FF]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <img
                className="w-[28px] h-[28px] sm:w-3 sm:h-3"
                src={variant.swatch}
                alt=''
              />
              {variant.label}
            </button>
          ))}
        </div>
      )}

      {/* Quantity Stepper + Price */}
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <QuantityStepper
          quantity={quantity}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          bg='#F0F4F7'
        />

        {/* Price */}
        <div className="text-right">
          {product.compareAtPrice && (
            <span className="text-xs sm:text-sm text-[#D8392B] line-through block">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base sm:text-lg font-bold text-[#1F1F1F]">
            ${displayPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductCard)