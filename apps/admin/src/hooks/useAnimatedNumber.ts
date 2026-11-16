import { ref, onBeforeUnmount } from 'vue'

export function useAnimatedNumber(initialValue = 0, duration = 500) {
  const valueRef = ref(initialValue)
  let frameId: number | null = null

  const animateTo = (target: number) => {
    const start = valueRef.value
    const startTime = performance.now()

    if (frameId) cancelAnimationFrame(frameId)

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      valueRef.value = Math.floor(start + (target - start) * progress)
      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        frameId = null
      }
    }

    frameId = requestAnimationFrame(step)
  }

  onBeforeUnmount(() => {
    if (frameId) cancelAnimationFrame(frameId)
  })

  return {
    valueRef,
    animateTo,
  }
}