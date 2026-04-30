import { useMemo } from 'react'

export function useVirtualRows({ itemCount, rowHeight, viewportHeight, scrollTop, overscan = 5 }) {
  return useMemo(() => {
    const safeCount = Math.max(0, itemCount)
    const safeRowHeight = Math.max(1, rowHeight)
    const safeViewportHeight = Math.max(0, viewportHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / safeRowHeight) - overscan)
    const visibleCount = Math.ceil(safeViewportHeight / safeRowHeight) + overscan * 2
    const endIndex = Math.min(safeCount, startIndex + visibleCount)
    const items = []

    for (let index = startIndex; index < endIndex; index += 1) {
      items.push({
        index,
        offsetTop: index * safeRowHeight,
      })
    }

    return {
      items,
      totalHeight: safeCount * safeRowHeight,
    }
  }, [itemCount, overscan, rowHeight, scrollTop, viewportHeight])
}
