import React, { useState, useEffect } from "react"
import LoadingScreen from "./LoadingScreen"

interface LoadingWrapperProps {
  children: React.ReactNode
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate an initial loading period. In a real app, you might
    // hide the loader after fetching data or loading assets.
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // 2.5 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer)
  }, [])

  return <>{isLoading ? <LoadingScreen /> : children}</>
}

export default LoadingWrapper