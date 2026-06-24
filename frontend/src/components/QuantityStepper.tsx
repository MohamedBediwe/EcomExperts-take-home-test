import { memo } from 'react'

interface QuantityStepperProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  bg?: "white" | "#F0F4F7"
}

function QuantityStepper({ quantity, onDecrease, onIncrease, bg="white" }: QuantityStepperProps) {

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity === 0}
        className={`bg-${bg} w-[20px] h-[20px] rounded-sm flex items-center justify-center ${
          quantity === 0
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        -
      </button>

      <span className={`w-[20px] h-[20px] text-center font-semibold `}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className={`bg-${bg} w-[20px] h-[20px] rounded-sm bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center`}
      >
        +
      </button>
    </div>
  )
}

export default memo(QuantityStepper)