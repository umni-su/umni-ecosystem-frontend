<script>
export default {
  name: 'LogItem',
  props: {
    log: {
      type: Object,
      required: true
    }
  },
  computed: {
    ts(){
      return this.$moment(this.log.timestamp).format('DD.MM.YYYY HH:mm:ss')
    },
    type() {
      return this.log.logger_type
    },
    message() {
      return this.log.message
    },
    color(){
      switch (this.log.level) {
      case 'INFO':
        return 'success'
      case 'ERROR':
        return 'error'
      case 'WARNING':
        return 'warning'
      case 'DEBUG':
        return 'info'
      default:
        return 'grey'
      }
    }
  }
}
</script>

<template>
  <VListItem
    density="compact"
    rounded="0"
    class="pa-2"
    :value="log"
  >
    <VListItemSubtitle>
      <VChip
        :color="color"
        class="mt-2 mr-2"
        density="comfortable"
        size="small"
        :text="log.level"
      />
      <VChip
        class="mt-2"
        density="comfortable"
        size="small"
        :text="type"
      />
    </VListItemSubtitle>
    <VListItemTitle>
      <VSheet class="text-subtitle-2 mt-1 opacity-70">
        {{ ts }}
      </VSheet>
      <VSheet class="mt-2 text-subtitle-2">
        {{log.message}}
      </VSheet>
    </VListItemTitle>
  </VListItem>
</template>

<style scoped lang="scss">
.text-small {
    font-size: 80%;
}
</style>
