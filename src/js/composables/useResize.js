import {computed, onBeforeUnmount, ref} from 'vue'

// Ширина считается в колонках сетки (из 12)
export const MIN_SIZE = 1
export const MAX_SIZE = 12
// Высота — в пикселях
export const MIN_HEIGHT = 80
export const MAX_HEIGHT = 600
export const HEIGHT_STEP = 10
// Задержка перед фиксацией изменения, чтобы не дёргать сервер на каждый пиксель
const COMMIT_DELAY = 150

function clamp(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))
}

// Ширина — целые колонки, высота — кратные HEIGHT_STEP пиксели
function normalize(value, min, max, step, fallback) {
  const clamped = clamp(value, min, max, fallback)
  const snapped = step > 0 ? Math.round(clamped / step) * step : clamped
  return clamp(snapped, min, max, fallback)
}

/**
 * Общее изменение размера перетаскиванием за ручку.
 * Для оси X шаг считается по ширине ближайшего stepSelector (1/12),
 * для оси Y — фиксированный шаг в пикселях.
 */
function useDragResize({
  axis = 'x',
  getSize,
  setSize,
  commit,
  defaultSize,
  min = MIN_SIZE,
  max = MAX_SIZE,
  step = 1,
  measure,
  stepSelector = '.v-row'
} = {}) {
  const dragging = ref(false)
  let startPointer = 0
  let startSize = defaultSize ?? min
  let pixelStep = 1
  let commitTimer = null

  const fallback = defaultSize ?? min
  const size = computed(() => normalize(getSize?.(), min, max, step, fallback))

  function scheduleCommit(value) {
    clearTimeout(commitTimer)
    commitTimer = setTimeout(() => {
      commit?.(value)
    }, COMMIT_DELAY)
  }

  function applySize(value) {
    const next = normalize(value, min, max, step, startSize)
    const current = getSize?.()
    if (hasValue(current) && Number(current) === next) return
    setSize?.(next)
    scheduleCommit(next)
  }

  function pointerPos(event) {
    if (axis === 'y') return event.clientY ?? event.touches?.[0]?.clientY ?? 0
    return event.clientX ?? event.touches?.[0]?.clientX ?? 0
  }

  function onPointerMove(event) {
    if (!dragging.value) return
    if (event.cancelable) event.preventDefault()
    const diff = Math.round((pointerPos(event) - startPointer) / pixelStep)
    applySize(startSize + diff * step)
  }

  function stopDrag() {
    if (!dragging.value) return
    dragging.value = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', stopDrag)
    window.removeEventListener('pointercancel', stopDrag)
  }

  function calcPixelStep(event) {
    if (axis === 'y') return step
    const row = event?.currentTarget?.closest?.(stepSelector)
    const width = row?.getBoundingClientRect().width ?? 0
    return Math.max(10, (width || 1200) / MAX_SIZE)
  }

  function resolveStartSize(event) {
    const current = getSize?.()
    if (hasValue(current)) return clamp(current, min, max, fallback)
    if (typeof measure === 'function') {
      const measured = measure(event)
      if (hasValue(measured)) return clamp(measured, min, max, fallback)
    }
    return fallback
  }

  function changeSize(event) {
    if (event) event.preventDefault()
    dragging.value = true
    startPointer = pointerPos(event)
    startSize = normalize(resolveStartSize(event), min, max, step, fallback)
    pixelStep = calcPixelStep(event)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDrag)
    window.addEventListener('pointercancel', stopDrag)
  }

  onBeforeUnmount(() => {
    stopDrag()
    clearTimeout(commitTimer)
  })

  return {size, dragging, changeSize}
}

/**
 * Изменение ширины блока перетаскиванием за ручку (влево — меньше, вправо — больше).
 * Шаг считается по ширине контейнера, найденного через stepSelector,
 * поэтому подходит и для карточки (ряд страницы), и для айтема (masonry-сетка).
 *
 * @param {Object} options
 * @param {Function} options.getSize — текущая ширина (1..12)
 * @param {Function} options.setSize — запись ширины (живое изменение)
 * @param {Function} [options.commit] — фиксация после перетаскивания (с дебаунсом)
 * @param {Number} [options.defaultSize=MAX_SIZE] — ширина, если getSize() не число
 * @param {String} [options.stepSelector='.v-row'] — контейнер, от ширины которого считается шаг колонки
 * @returns {{size: import('vue').ComputedRef<number>, dragging: import('vue').Ref<boolean>, changeWidth: Function}}
 */
export function useHorizontalResize({defaultSize = MAX_SIZE, ...options} = {}) {
  const {size, dragging, changeSize} = useDragResize({
    ...options,
    axis: 'x',
    min: MIN_SIZE,
    max: MAX_SIZE,
    step: 1,
    defaultSize
  })
  return {size, dragging, changeWidth: changeSize}
}

/**
 * Изменение высоты блока перетаскиванием за ручку (вверх — меньше, вниз — больше).
 * Высота в пикселях; если она не задана, стартуем от реальной высоты элемента.
 *
 * @param {Object} options
 * @param {Function} options.getSize — текущая высота в пикселях
 * @param {Function} options.setSize — запись высоты (живое изменение)
 * @param {Function} [options.commit] — фиксация после перетаскивания (с дебаунсом)
 * @param {Function} [options.measure] — измерить высоту элемента, если getSize() пуст
 * @param {Number} [options.min=MIN_HEIGHT]
 * @param {Number} [options.max=MAX_HEIGHT]
 * @param {Number} [options.step=HEIGHT_STEP]
 * @returns {{size: import('vue').ComputedRef<number>, dragging: import('vue').Ref<boolean>, changeHeight: Function}}
 */
export function useVerticalResize({
  defaultSize = MIN_HEIGHT,
  min = MIN_HEIGHT,
  max = MAX_HEIGHT,
  step = HEIGHT_STEP,
  ...options
} = {}) {
  const {size, dragging, changeSize} = useDragResize({
    ...options,
    axis: 'y',
    min,
    max,
    step,
    defaultSize
  })
  return {size, dragging, changeHeight: changeSize}
}
