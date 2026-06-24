import React from 'react'

interface IProps {
    finalTotal: number,
    subtotal: number
    totalSavings: number
    className?: string
}

function PricesComponent({subtotal, totalSavings, finalTotal, className} : IProps) {
  return (
    <div className={`flex-col lg:flex-row lg:justify-between ${className}`}>
        <div className="mt-4 text-right">
          <span className="text-xs text-white bg-[#4E2FD2] px-2 py-0.5 rounded">
            as low as $19.19/mo
          </span>
        </div>

        <div className="flex items-baseline justify-end gap-3 mt-2">
          <span className="text-lg sm:text-xl text-gray-400 line-through align-bottom">
            ${(subtotal + totalSavings).toFixed(2)}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#4E2FD2]">${finalTotal.toFixed(2)}</span>
        </div>
    </div>
  )
}

export default PricesComponent