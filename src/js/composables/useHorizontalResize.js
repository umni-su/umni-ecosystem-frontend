import {computed, onBeforeUnmount, ref} from 'vue'

// Ширина считается в колонках сетки (из 12)
export const MIN_SIZE = 1
export const MAX_SIZE = 12
// Задержка перед фиксацией изменения, чтобы не дёргать сервер на каждый пиксель
const COMMIT_DELAY = 150

function clampSize(value, fallback = MAX_SIZE) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(number)))
}

/**
 * Изменение ширины блока перетаскиванием за ручку (влево — меньше, вправо — больше).
 * Шаг считается по ширине ближайшего .v-row, поэтому composable подходит
 * и для карточки (ряд страницы), и для айтема (ряд внутри карточки).
 *
 * @param {Object} options
 * @param {Function} options.getSize — текущая ширина (1..12)
 * @param {Function} options.setSize — запись ширины (живое изменение)
 * @param {Function} [options.commit] — фиксация после перетаскивания (с дебаунсом)
 * @param {Number} [options.defaultSize=MAX_SIZE] — ширина, если getSize() не число
 * @returns {{size: import('vue').ComputedRef<number>, dragging: import('vue').Ref<boolean>, changeWidth: Function}}
 */
export function useHorizontalResize({getSize, setSize, commit, defaultSize = MAX_SIZE} = {}) {
  const dragging = ref(false)
  let startX = 0
  let startSize = defaultSize
  let pixelStep = 100
  let commitTimer = null

  const size = computed(() => clampSize(getSize?.(), defaultSize))

  function scheduleCommit(value) {
    clearTimeout(commitTimer)
    commitTimer = setTimeout(() => {
      commit?.(value)
    }, COMMIT_DELAY)
  }

  function applySize(value) {
    const next = clampSize(value, defaultSize)
    if (next === size.value) return
    setSize?.(next)
    scheduleCommit(next)
  }

  function pointerX(event) {
    return event.clientX ?? event.touches?.[0]?.clientX ?? 0
  }

  function onPointerMove(event) {
    if (!dragging.value) return
    if (event.cancelable) event.preventDefault()
    const diff = Math.round((pointerX(event) - startX) / pixelStep)
    applySize(startSize + diff)
  }

  function stopDrag() {
    if (!dragging.value) return
    dragging.value = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', stopDrag)
    window.removeEventListener('pointercancel', stopDrag)
  }

  // Шаг = ширина одной колонки (1/12 ширины ряда)
  function calcPixelStep(event) {
    const row = event?.currentTarget?.closest?.('.v-row')
    const width = row?.getBoundingClientRect().width ?? 0
    return Math.max(10, (width || 1200) / MAX_SIZE)
  }

  function changeWidth(event) {
    if (event) event.preventDefault()
    dragging.value = true
    startX = pointerX(event)
    startSize = size.value
    pixelStep = calcPixelStep(event)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDrag)
    window.addEventListener('pointercancel', stopDrag)
  }

  onBeforeUnmount(() => {
    stopDrag()
    clearTimeout(commitTimer)
  })

  return {size, dragging, changeWidth}
}
