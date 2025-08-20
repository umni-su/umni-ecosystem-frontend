<script>
import formatBytes from '../../../js/helpers/formatBytes.js'

export default {
  name: 'DiskUsageItem',
  props: {
    disk: {
      type: Object,
      required: true
    }
  },
  computed: {
    stat() {
      return this.disk.stat
    },
    free() {
      return (100 * this.stat.free / this.stat.total).toFixed(2)
    },
    used() {
      return 100 - this.free
    },
    color() {
      if (this.free > 50) return 'success'
      else if (this.free < 50 && this.free > 25) return 'warning'
      else return 'error'
    },
    sizeTotal() {
      return formatBytes(this.stat.total, 2)
    },
    sizeFree() {
      return formatBytes(this.stat.free, 2)
    }
  }
}
</script>

<template>
  <VCard
    density="compact"
    variant="text"
  >
    <template #title>
      {{ disk.device }}
    </template>
    <template #append>
      <div class="text-subtitle-2 opacity-50">
        {{ sizeFree.val }} {{ sizeFree.size }} {{ $t('free of') }} {{ sizeTotal.val }} {{ sizeTotal.size }}
      </div>
    </template>
    <template #text>
      <VProgressLinear
        height="6"
        :model-value="used"
        :color="color"
      />
    </template>
  </VCard>
</template>

<style scoped>

</style>