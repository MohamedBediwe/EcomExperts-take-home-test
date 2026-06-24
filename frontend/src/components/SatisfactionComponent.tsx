import React from 'react'
import satisfactionBadge from "../assets/Satisfaction Badge-05 1.png"

function SatisfactionComponent() {
  return (
    <div className="flex items-start gap-3 mt-6">
          <div className='flex flex-col'>
            <img src={satisfactionBadge} alt="100$ wyze satisfaction gurentee " />
            
          </div>
          <div className="flex-1 hidden md:flex flex-col gap-4 mt-4">
            <p className="text-xs sm:text-sm font-medium text-[#1F1F1F]">30-day hassle-free returns</p>
            <p className="text-[10px] sm:text-xs text-gray-500">
              If you're not totally in love with the product, we will refund you 100%.
            </p>
          </div>
    </div>
  )
}

export default SatisfactionComponent