import React from 'react'

interface IProps {
confirmCheckout: () => void
}

function CheckoutModal({confirmCheckout} :IProps ) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">Order Confirmed!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Thank you for your purchase. Your security system is on its way!
            </p>
            <button
              type="button"
              onClick={confirmCheckout}
              className="w-full py-3 bg-[#6B4CFF] text-white font-bold rounded-lg hover:bg-[#5a3fd6] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
  )
}

export default CheckoutModal