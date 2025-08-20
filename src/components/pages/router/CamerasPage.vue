<script>
import CameraItem from '../../chunks/camera/CameraItem.vue'
import CameraForm from '../../chunks/camera/CameraForm.vue'
import SidebarPanel from '../../chunks/SidebarPanel.vue'

export default {
  name: 'CamerasPage',
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
      return this.$store.getters['getCameras']
    },
    storages() {
      return this.$store.getters['getStorages']
    }
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
  <VContainer
    class="pa-0"
    fluid
  >
    <VRow no-gutters>
      <VCol v-if="storages.length === 0">
        <VEmptyState>
          <template #headline>{{$t('There are no storages')}}</template>
          <template #title>{{$t('You should add at least one storage')}}</template>
          <template #media>
            <VIcon
              icon="mdi-database"
              size="200"
            />
          </template>
          <template #actions>
            <VBtn
              color="primary"
              prepend-icon="mdi-plus"
              :text="$t('Add')"
            />
          </template>

        </VEmptyState>
      </VCol>
      <VCol v-if="storages.length>0">
        <VCard
          variant="text"
        >
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
              :icon="!open?'mdi-plus' : 'mdi-chevron-left'"
              color="default"
              @click="openModal()"
            />
          </template>
          <VCardText class="pa-0">
            <VContainer fluid>
              <VRow>
                <CameraItem
                  v-for="camera in cameras"
                  :key="camera.id"
                  :camera="camera"
                />
              </VRow>
            </VContainer>
          </VCardText>
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