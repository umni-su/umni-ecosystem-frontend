<script>
import ModalDialog from "../../chunks/ModalDialog.vue";
import CameraProtocolSelect from "../../chunks/camera/CameraProtocolSelect.vue";
import CameraRecordDurationSelect from "../../chunks/camera/CameraRecordDurationSelect.vue";
import CameraDeleteAfterSelect from "../../chunks/camera/CameraDeleteAfterSelect.vue";
import {createManyNotifications, createSuccessNotification} from "../../../js/helpers/notificationHelper.js";
import StorageSelect from "../../chunks/storage/StorageSelect.vue";
import CameraItem from "../../chunks/camera/CameraItem.vue";

export default {
  name: "CamerasPage",
  components: {
    CameraItem,
    StorageSelect,
    CameraDeleteAfterSelect,
    CameraRecordDurationSelect,
    CameraProtocolSelect,
    ModalDialog
  },
  data() {
    return {
      asLink: false,
      auth: false,
      link: null,
      open: false,
      model: {}
    }
  },
  computed: {
    disabled() {
      return this.model?.storage_id === undefined
          || this.model?.name?.length === undefined
          || this.model?.protocol?.length === undefined
          || this.model?.port === undefined
          || this.model?.ip?.length === undefined
    },
    cameras() {
      return this.$store.getters['getCameras'];
    },
    loading() {
      return this.$store.getters['isLoading'];
    },
    title() {
      return this.model.id ? this.$t('Edit camera') : this.$t('Add camera')
    }
  },
  watch: {
    model: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.asLink) {

        } else {
          this.updateLink()
        }
      }
    }
  },
  async created() {
    this.$store.commit('setTitle', this.$t('Cameras'))
    await this.getCameras()
  },
  methods: {
    openModal() {
      this.open = true
    },
    toggleView() {
      this.asLink = !this.asLink
      this.link = null
    },
    async getCameras() {
      await this.$store.dispatch('getCameras')
    },
    async saveCamera() {
      const method = this.model.id ? 'updateCamera' : 'addCamera'
      const res = await this.$store.dispatch(method, this.model).catch(e => {
        this.$store.commit('addNotification', createManyNotifications('error', e.response.data.error))
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
        this.open = false
        this.model = {}
      }
    },
    updateLink() {
      const ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/
      if (this.model?.protocol) {
        this.link = `${this.model.protocol.toLowerCase()}://`
        if (this.auth && this.model?.username && this.model?.password) {
          this.link += `${this.model.username}:${this.model.password}@`
        }
        if (this.model?.ip && ipReg.test(this.model.ip)) {
          this.link += `${this.model.ip.toLowerCase()}`
          if (this.model?.port) {
            this.link += `:${this.model.port}`
            if (this.model?.primary) {
              this.link += `/${this.model.primary.toLowerCase()}`
            }
          }
        }
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
        <ModalDialog
          v-model="open"
          :title="title"
        >
          <VSheet
            v-if="link"
            class="mb-2"
          >
            <VCode class="d-block">
              {{ link }}
            </VCode>
          </VSheet>
          <VTextField
            v-model="model.name"
            :label="$t('Name')"
          />
          <StorageSelect
            v-model="model.storage_id"
            class="mt-4"
          />
          <VTextField
            v-if="asLink"
            v-model="link"
            :label="$t('Link')"
          />
          <VSheet v-else>
            <CameraProtocolSelect
              v-model="model.protocol"
              class="mt-4"
            />
            <VTextField
              v-model="model.ip"
              :label="$t('IP address')"
              class="mt-4"
            />
            <VTextField
              v-model.number="model.port"
              :label="$t('Port')"
              class="mt-4"
            />
            <VTextField
              v-model.number="model.primary"
              :label="$t('Primary stream')"
              class="mt-4"
            />
            <VTextField
              v-model.number="model.secondary"
              :label="$t('Secondary stream')"
              class="mt-4"
            />
            <VSwitch
              v-model="auth"
              :label="$t('Authentication')"
            />
            <VTextField
              v-if="auth"
              v-model="model.username"
              :label="$t('Username')"
            />
            <VTextField
              v-if="auth"
              v-model="model.password"
              class="mt-4"
              :label="$t('Password')"
              type="password"
            />
          </VSheet>
          <VSwitch
            v-model="model.record"
            :label="$t('Record')"
            :true-value="true"
            :false-value="false"
          />
          <CameraRecordDurationSelect
            v-if="model.record"
            v-model="model.recordDuration"
          />
          <CameraDeleteAfterSelect
            v-if="model.record"
            v-model="model.deleteAfter"
            class="mt-4"
          />
          <template #actions>
            <VBtn
              color="default"
              :prepend-icon="asLink ? 'mdi-text-box' : 'mdi-link'"
              :text="asLink ? $t('Form mode') : $t('Link mode')"
              @click="toggleView"
            />
            <VBtn
              :disabled="loading || disabled"
              :text="$t('Save')"
              prepend-icon="mdi-content-save"
              @click="saveCamera"
            />
          </template>
        </ModalDialog>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>

</style>