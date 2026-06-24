import React from 'react'

function CheckoutButton({handleCheckout} : {handleCheckout: () => void}) {
  return (
    <button
          type="button"
          onClick={handleCheckout}
          className="w-full mt-4 py-3 bg-[#6B4CFF] text-white font-bold rounded-lg hover:bg-[#5a3fd6] transition-colors"
        >
          Checkout
        </button>
  )
}

export default CheckoutButton