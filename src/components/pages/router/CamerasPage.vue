<script>
import CameraItem from "../../chunks/camera/CameraItem.vue";
import CameraForm from "../../chunks/camera/CameraForm.vue";
import SidebarPanel from "../../chunks/SidebarPanel.vue";

export default {
  name: "CamerasPage",
  components: {
    SidebarPanel,
    CameraForm,
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
      this.open = !this.open
    },
    async getCameras() {
      await this.$store.dispatch('getCameras')
    },
    onCameraSave() {
      this.open = false
      this.model = {
        active: true
      }
    }
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
        <SidebarPanel v-model="open">
          <CameraForm
            :camera-model="model"
            @on-camera-save="onCameraSave"
          />
        </SidebarPanel>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>

</style>