<script>
import CameraProtocolSelect from "./CameraProtocolSelect.vue";
import ModalDialog from "../ModalDialog.vue";
import CameraDeleteAfterSelect from "./CameraDeleteAfterSelect.vue";
import CameraRecordDurationSelect from "./CameraRecordDurationSelect.vue";
import StorageSelect from "../storage/StorageSelect.vue";
import {createManyNotifications, createSuccessNotification} from "../../../js/helpers/notificationHelper.js";
import CameraRecordModeSelect from "./CameraRecordModeSelect.vue";

export default {
  name: "CameraModal",
  components: {
    CameraRecordModeSelect,
    StorageSelect,
    CameraRecordDurationSelect,
    CameraDeleteAfterSelect,
    ModalDialog,
    CameraProtocolSelect
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    cameraModel: {
      type: Object,
      required: true
    }
  },
  emits: ['on-update-model', 'update:model-value'],
  data() {
    return {
      asLink: false,
      auth: false,
      link: null,
      model: null,
      open: false,
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
      return this.$store.getters['isLoading'];
    },
    title() {
      return this.model.id ? this.$t('Edit camera') : this.$t('Add camera')
    }
  },
  watch: {
    auth() {
      this.model.username = null
      this.model.password = null
    },
    model: {
      deep: true,
      handler(newVal, oldVal) {
        this.$emit('on-update-model', newVal);
      }
    },
    modelValue: {
      deep: true,
      handler(newVal, oldVal) {
        this.open = this.modelValue
        this.model = this.cameraModel
      }
    },
    open() {
      this.$emit('update:model-value', this.open)
    },
  },
  created() {
    this.model = this.cameraModel
    if (this.model?.username?.length > 0 && this.model?.password?.length > 0) {
      this.auth = true
    }
    this.open = this.modelValue
  },
  methods: {
    toggleView() {
      this.asLink = !this.asLink
      this.link = null
    },
    async saveCamera() {
      const method = this.model.id ? 'updateCamera' : 'addCamera'
      const res = await this.$store.dispatch(method, this.model).catch(e => {
        this.$store.commit('addNotification', createManyNotifications('error', e.response.data.error))
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
        this.open = false
        this.model = {
          active: true
        }
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
  <ModalDialog
    v-model="open"
    :title="title"
  >
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
      <VTextField
        v-if="auth"
        v-model="model.username"
        clearable
        :label="$t('Username')"
      />
      <VTextField
        v-if="auth"
        v-model="model.password"
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
</template>

<style scoped>

</style>