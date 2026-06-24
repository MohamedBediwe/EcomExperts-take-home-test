import { useEffect } from 'react'
import { useStore } from './store/useStore'
import StepsSection from './components/StepsSection'
import ReviewSection from './components/ReviewSection'

function App() {
  const setSteps = useStore((state) => state.setSteps)
  const setLoading = useStore((state) => state.setLoading)
  const setError = useStore((state) => state.setError)
  const loadSavedSession = useStore((state) => state.loadSavedSession)
  const isLoading = useStore((state) => state.isLoading)
  const error = useStore((state) => state.error)

  useEffect(() => {
    // Load saved cart from localStorage (if user previously clicked "Save for later")
    loadSavedSession()

    const controller = new AbortController()

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error(`Products API returned ${res.status}`)
        }
        const data = await res.json()
        setSteps(data.steps)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Failed to load products')
        console.error(err)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [loadSavedSession, setError, setLoading, setSteps])

  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-[1.5rem] sm:text-[2rem] font-gilroy text-center font-bold text-[#1F1F1F] tracking-[-0.06px] leading-[1.1] mt-6 sm:mt-[31px] mb-4 sm:mb-5 px-4">
        Let's get started!
      </h1>

      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}. Make sure the backend server is running at http://localhost:5000.
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-lg border border-[#D8E2F0] bg-[#EFF6FF] px-4 py-3 text-sm text-[#484848]">
            Loading products...
          </div>
        )}
        <div className="flex flex-col lg:flex-row xl:flex-col lg:gap-8">
          {/* Left: Builder — always first on mobile, left on desktop */}
          <div className="flex-1">
            <StepsSection />
          </div>

          {/* Right: Review Panel — below on mobile, sticky sidebar on desktop */}
          <div className="w-full lg:w-[400px] xl:w-full">
            <div className="lg:sticky lg:top-4">
              <ReviewSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App