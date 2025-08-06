<script>

import ModalDialog from '../ModalDialog.vue'

export default {
  name: 'CameraEventImage',
  components: {ModalDialog},
  props: {
    event: {
      type: Object,
      required: true
    },
    download: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      src: null,
      original: null,
      open: false
    }
  },
  watch: {
    event: {
      deep: true,
      handler(newVal, oldVal) {
        this.getPreview()
      }
    }
  },
  created() {
    this.getPreview()
  },
  methods: {
    getPreview() {
      this.$store.dispatch('getCameraEventScreenshot', {id: this.event.id, type: 'resized'}).then(res => {
        this.src = res
      })
    },
    getOriginal() {
      this.$store.dispatch('getCameraEventScreenshot', {id: this.event.id, type: 'original'}).then(res => {
        this.src = res
        this.original = res
      })
    },
    downloadEvent() {
      const link = document.createElement('a')
      link.href = this.src
      link.download = `Event_${this.event.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    showOriginal() {
      this.open = true
    }
  }
}
</script>

<template>
  <VHover @update:model-value="$event ? getOriginal() : getPreview()">
    <template #default="{ isHovering, props }">
      <VSheet
        class="event-image d-inline position-relative"
        v-bind="props"
      >
        <VFadeTransition>
          <VSheet
            v-if="isHovering"
            color="rgba(0,0,0,0.7)"
            class="download-overlay"
          >
            <VBtn
              color="white"
              rounded="pill"
              variant="tonal"
              icon="mdi-magnify"
              @click="showOriginal"
            />
            <VBtn
              v-if="download"
              color="white"
              class="ml-4"
              rounded="pill"
              variant="tonal"
              icon="mdi-download"
              @click="downloadEvent"
            />
          </VSheet>
        </VFadeTransition>
        <VImg
          v-if="src"
          class="cursor-pointer"
          :src="src"
        />
        <ModalDialog
          v-model="open"
          :title="$t('Event {id}', {id:event.id})"
          max-width="1000"
          width="100%"
        >
          <VImg
            :src="original"
          />
        </ModalDialog>
      </VSheet>
    </template>
  </VHover>
</template>

<style lang="scss" scoped>
.download-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>