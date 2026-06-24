import { type FC, type JSX } from 'react'
import type { TStepComponent } from '../util/accordionSteps'
import { useStore } from '../store/useStore'
import ProductCard from './ProductCard'
import arrowUp from "../assets/arrow-up.svg"
import arrowDown from "../assets/arrow-down.svg"
import SectionHeader from './SectionHeader'

interface IProps extends TStepComponent {
  step: number
  isActive: boolean
  onToggle: () => void
  onNext: () => void
  nextStepTitle: string | null
  stepsTotal: number
}

const StepAccordion: FC<IProps> = ({ step, title, icon, isActive, onNext, onToggle, nextStepTitle, stepsTotal }): JSX.Element => {
  const selectedProductsCount = useStore((state) => state.getSelectedCount(step))
  const steps = useStore((state) => state.steps)
  
  const currentStep = steps?.find((s) => s.id === step)
  const products = currentStep?.products || []

  return (
    <section className={`${
        isActive ? 'border-[#6B4CFF] bg-[#F8F6FF] rounded-xs' : 'border-gray-200 bg-white'
      }`}>
      <SectionHeader text={`step ${step} of ${stepsTotal}`} />
      
      <div 
        onClick={onToggle} 
        className={`cursor-pointer flex justify-between items-center border-y-[#1F1F1F70] border-y-[0.5px] border-y ${isActive && "border-b-transparent"}`}
      >
        <h2 className='flex items-center px-[15px] gap-2 py-5'>
          <img src={icon} alt={title} className="w-6 h-6" />
          <span className='font-bold text-[#1F1F1F]'>{title}</span>
        </h2>
        <div className='flex items-center gap-2 px-[15px]'>
          <span className='text-[#6B4CFF] text-sm font-medium'>
            {selectedProductsCount} selected
          </span>
          <span>
            <img src={isActive ? arrowUp : arrowDown} alt="arrow" className="w-4 h-4" />
          </span>
        </div>
      </div>

      {isActive && (
        <div className="px-[15px] pb-5">
          {/* Products */}
          <div className="flex flex-wrap justify-center flex-col md:flex-row gap-4 py-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} stepId={step} />
            ))}
          </div>

          {/* Next button */}
          {nextStepTitle && (
            <div className="flex justify-center mt-4">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="px-8 py-3 rounded-full border-2 border-[#6B4CFF] text-[#6B4CFF] font-semibold hover:bg-[#6B4CFF] hover:text-white transition-colors"
              >
                Next: {nextStepTitle}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default StepAccordion
