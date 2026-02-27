import { useEffect, useState } from 'react'

const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [duration, value])

  return <span>{count.toLocaleString()}</span>
}

export default AnimatedCounter
