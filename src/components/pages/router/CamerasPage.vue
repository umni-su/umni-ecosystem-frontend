<script>
import CameraItem from "../../chunks/camera/CameraItem.vue";
import CameraModal from "../../chunks/camera/CameraModal.vue";

export default {
  name: "CamerasPage",
  components: {
    CameraModal,
    CameraItem
  },
  data() {
    return {
      open: false,
      model: {
        active: true
      }
    }
  },
  computed: {
    cameras() {
      return this.$store.getters['getCameras'];
    },
  },
  async created() {
    this.$store.commit('setTitle', this.$t('Cameras'))
    await this.getCameras()
  },
  methods: {
    openModal() {
      this.open = true
    },

    async getCameras() {
      await this.$store.dispatch('getCameras')
    },

  }
}
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol>
        <VCard>
          <template #append>
            <VBtn
              density="comfortable"
              variant="plain"
              icon="mdi-reload"
              color="default"
              class="mr-2"
              @click="getCameras()"
            />
            <VBtn
              density="comfortable"
              variant="plain"
              icon="mdi-plus"
              color="default"
              @click="openModal()"
            />
          </template>
          <template #text>
            <VContainer fluid>
              <VRow>
                <CameraItem
                  v-for="camera in cameras"
                  :key="camera.id"
                  :camera="camera"
                />
              </VRow>
            </VContainer>
          </template>
        </VCard>
        <CameraModal
          v-model="open"
          :camera-model="model"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>

</style>