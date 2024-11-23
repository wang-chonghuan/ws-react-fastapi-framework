import { useEffect, useState } from 'react'
import axios from 'axios'
import { Circle } from 'lucide-react'

function HealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/health`)
        setIsHealthy(response.status === 200)
      } catch (error) {
        setIsHealthy(false)
      }
    }
    
    checkHealth()
    
    const interval = setInterval(checkHealth, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-2 right-2">
      <Circle
        size={4}
        fill={isHealthy ? '#22c55e' : '#ef4444'}
        className={`${isHealthy ? 'text-green-500' : 'text-red-500'}`}
      />
    </div>
  )
}

export default HealthCheck
