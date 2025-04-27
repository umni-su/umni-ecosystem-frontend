<script>
export default {
    name: "UmniLogo",
    props: {
        size: {
            type: Number,
            default: 100
        },
        color: {
            type: String,
            default: '#ffffff'
        }
    }
}
</script>

<template>
  <svg
    class="logo"
    xmlns="http://www.w3.org/2000/svg"
    xml:space="preserve"
    :width="size"
    :height="size"
    version="1.1"
    viewBox="0 0 100 100"
    :fill="color"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g>
      <metadata />
      <path
        d="M83.03 5.18l-0.3 0c-1.69,0 -3.09,1.4 -3.09,3.11l0 36.08c0,17.34 -4.78,28.9 -20.7,28.9 -16.03,0 -21.8,-11.56 -21.8,-28.9l0 -36.08c0,-1.71 -1.3,-3.11 -2.99,-3.11l-0.3 0c-1.69,0 -3.09,1.4 -3.09,3.11l0 36.08c0,20.84 7.37,34.88 28.18,34.88 20.7,0 27.17,-14.04 27.17,-34.88l0 -36.08c0,-1.71 -1.39,-3.11 -3.08,-3.11z"
      />
      <path
        d="M68.99 5.18l-0.3 0c-1.69,0 -3.09,1.4 -3.09,3.11l0 36.08c0,17.34 -4.77,28.9 -20.7,28.9 -16.03,0 -21.8,-11.56 -21.8,-28.9l0 -36.08c0,-1.71 -1.3,-3.11 -2.99,-3.11l-0.3 0c-1.69,0 -3.08,1.4 -3.08,3.11l0 36.08c0,20.84 7.36,34.88 28.17,34.88 20.7,0 27.18,-14.04 27.18,-34.88l0 -36.08c0,-1.71 -1.4,-3.11 -3.09,-3.11z"
      />
      <path
        d="M52.24 85.32l-0.53 0c-2.84,0 -5.24,2.22 -5.24,5.15l0 0.44c0,2.93 2.4,5.33 5.24,5.33l0.53 0c2.75,0 5.15,-2.4 5.15,-5.33l0 -0.44c0,-2.93 -2.4,-5.15 -5.15,-5.15z"
      />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.logo {
    shape-rendering: geometricPrecision;
    text-rendering: geometricPrecision;
    image-rendering: optimizeQuality;
    fill-rule: evenodd;
    clip-rule: evenodd
}
</style>
