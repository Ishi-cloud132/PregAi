import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Animates a numeric value on change — used for stat cards so live/demo data
// updates read as a deliberate, single moment rather than a jarring jump.
export function useCountUp(target: number, ref: React.RefObject<HTMLElement>, decimals = 0) {
  const current = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const obj = { val: current.current }
    gsap.to(obj, {
      val: target,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = obj.val.toFixed(decimals)
      },
      onComplete: () => {
        current.current = target
      },
    })
  }, [target])
}
