<script>
import CameraProtocolSelect from './CameraProtocolSelect.vue'
import CameraDeleteAfterSelect from './CameraDeleteAfterSelect.vue'
import CameraRecordDurationSelect from './CameraRecordDurationSelect.vue'
import StorageSelect from '../storage/StorageSelect.vue'
import {createManyNotifications, createSuccessNotification} from '../../../js/helpers/notificationHelper.js'
import CameraRecordModeSelect from './CameraRecordModeSelect.vue'
import CameraAreas from './CameraAreas.vue'

export default {
  name: 'CameraForm',
  components: {
    CameraAreas,
    CameraRecordModeSelect,
    StorageSelect,
    CameraRecordDurationSelect,
    CameraDeleteAfterSelect,
    CameraProtocolSelect
  },
  props: {
    cameraModel: {
      type: Object,
      required: true
    }
  },
  emits: ['on-camera-save', 'on-show-areas'],
  data() {
    return {
      tab: 'connection',
      tabs: [
        {
          name: this.$t('Connection'),
          key: 'connection',
          icon: 'mdi-connection'
        },
        {
          name: this.$t('Detection'),
          key: 'detection',
          icon: 'mdi-motion-sensor'
        }
      ],
      editCredentials: false,
      asLink: false,
      auth: false,
      link: null,
      model: null,
      showDrawings: false
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
    loading() {
      return this.$store.getters['isLoading']
    },
    modelHasCredentials() {
      return this.model.id !== null && (this.cameraModel?.has_credentials)
    }

  },
  watch: {
    tab() {
      this.showDrawings = this.tab === 'detection'
      this.$emit('on-show-areas', this.showDrawings)
    },
    cameraModel: {
      deep: true,
      handler(newValue) {
        this.init()
      }
    }
  },
  unmounted() {
    this.$store.commit('destroyTracker')
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.model = this.cameraModel
      this.model.password = null
      if (this.modelHasCredentials) {
        this.auth = true
      }
      this.open = this.modelValue
    },
    toggleView() {
      this.asLink = !this.asLink
      this.link = null
    },
    async saveCamera() {
      const method = this.model.id ? 'updateCamera' : 'addCamera'
      if (method === 'addCamera') {
        this.model.change_credentials = true
      } else {
        this.model.change_credentials = this.editCredentials
      }
      const res = await this.$store.dispatch(method, this.model).catch(e => {
        this.$store.commit('addNotification', createManyNotifications('error', e.response.data.error))
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
        this.$emit('on-camera-save', this.cameraModel)
      }
    },
    resetRecordValues() {
      this.model.record_mode = null
      this.model.record_duration = null
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
  <VSheet>
    <VTabs
      v-model="tab"
      align-tabs="center"
    >
      <VTab
        v-for="t in tabs"
        :key="t"
        :value="t.key"
        :text="t.name"
        :prepend-icon="t.icon"
      />
    </VTabs>
    <VTabsWindow
      v-model="tab"
      class="py-4"
    >
      <VTabsWindowItem value="connection">
        <VSheet>
          <VSheet
            v-if="link"
            class="mb-2"
          >
            <VCode class="d-block mb-4">
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
              v-model="model.active"
              :label="$t('Active')"
            />
            <VSwitch
              v-model="model.alerts"
              :label="$t('Alerts')"
            />
            <VSwitch
              v-model="auth"
              :label="$t('Authentication')"
            />
            <VSwitch
              v-if="modelHasCredentials && auth"
              v-model="editCredentials"
              :label="$t('Change credentials')"
            />
            <VTextField
              v-if="auth"
              v-model="model.username"
              :disabled="modelHasCredentials && !editCredentials"
              clearable
              :label="$t('Username')"
            />
            <VTextField
              v-if="auth"
              v-model="model.password"
              :disabled="modelHasCredentials && !editCredentials"
              clearable
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
            @update:model-value="resetRecordValues"
          />
          <CameraRecordModeSelect
            v-if="model.record"
            v-model.number="model.record_mode"
            class="mb-4"
          />
          <CameraRecordDurationSelect
            v-if="[1,2].indexOf(model.record_mode) > -1"
            v-model="model.record_duration"
          />
          <CameraDeleteAfterSelect
            v-if="model.record"
            v-model="model.delete_after"
            class="mt-4"
          />
          <VSheet class="py-4">
            <VBtn
              :disabled="loading || disabled"
              :text="$t('Save')"
              prepend-icon="mdi-content-save"
              @click="saveCamera"
            />
            <VBtn
              color="default"
              class="mr-4"
              :prepend-icon="asLink ? 'mdi-text-box' : 'mdi-link'"
              :text="asLink ? $t('Form mode') : $t('Link mode')"
              @click="toggleView"
            />
          </VSheet>
        </VSheet>
      </VTabsWindowItem>
      <VTabsWindowItem value="detection">
        <CameraAreas :camera="model" />
      </VTabsWindowItem>
    </VTabsWindow>
  </VSheet>
</template>

<style scoped>

</style>