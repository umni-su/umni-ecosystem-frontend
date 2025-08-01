<script>
import ModalDialog from "../ModalDialog.vue";

export default {
  name: "CameraEventImage",
  components: {ModalDialog},
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      src: null,
      original: null,
      open: false
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
      })
    },
    showOriginal() {
      this.getOriginal()
    }
  }
}
</script>

<template>
  <VImg
    v-if="src"
    class="cursor-pointer"
    :src="src"
    @mouseenter="showOriginal"
    @mouseleave="getPreview"
  />
</template>

<style scoped>

</style>