import { useState } from 'react'

export default function useNavigationRailState({ defaultPinned = false } = {}) {
  const [isNavPinned, setIsNavPinned] = useState(defaultPinned)
  const [isNavHovered, setIsNavHovered] = useState(false)

  return {
    isNavPinned,
    isNavHovered,
    isNavExpanded: isNavPinned || isNavHovered,
    pinNavigationRail() {
      setIsNavPinned(true)
    },
    unpinNavigationRail() {
      setIsNavPinned(false)
    },
    toggleNavigationRailPin() {
      setIsNavPinned((current) => !current)
    },
    handleNavigationRailMouseEnter() {
      if (!isNavPinned) {
        setIsNavHovered(true)
      }
    },
    handleNavigationRailMouseLeave() {
      if (!isNavPinned) {
        setIsNavHovered(false)
      }
    },
  }
}
