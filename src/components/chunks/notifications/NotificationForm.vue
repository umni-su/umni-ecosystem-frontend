<script>
import ConfigurationDynamicField from '../configuration/ConfigurationDynamicField.vue'
import NotificationsTypesSelect from './NotificationsTypesSelect.vue'
import NotificationTypeForm from './NotificationTypeForm.vue'
import {createErrorNotification, createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'NotificationForm',
  components: {NotificationTypeForm, NotificationsTypesSelect, ConfigurationDynamicField},
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'update:model-value'],
  data() {
    return {
      fields: null,
      schema: null,
      notification: {},
      form: {}
    }
  },
  computed: {
    loading() {
      return this.$store.getters['isLoading']
    }
  },
  created() {
    this.notification = this.modelValue
  },
  watch: {
    modelValue(newValue) {
      this.notification = newValue
    },
    notification(newValue) {
      this.$emit('update:model-value', newValue)
    }
  },
  methods: {
    clearFields() {
      this.fields = null
    },
    async addNotification() {
      const res = await this.$store.dispatch('notifications/addNotification', {
        ...this.notification,
        ...{
          options: this.form
        }
      }).catch(e => {
        this.$store.commit('addNotification', createErrorNotification(this.$t('Error')))
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification($t('Saved')))
      }
    }
  }
}
</script>

<template>
  <VForm>
    <VTextField
      v-model="notification.name"
      class="mb-4"
      :label="$t('Name')"
    />
    <NotificationsTypesSelect
      v-model="notification.type"
      class="mb-4"
      @update:model-value="clearFields"
      @update:fields="fields = $event"
    />
    <NotificationTypeForm
      v-model="fields"
      @update:form-data="form = $event"
    />
    <VSwitch
      v-if="notification.type !== null"
      v-model="notification.active"
      class="mb-4"
      :label="$t('Active')"
    />
    <VBtn
      v-if="notification.type !== null"
      density="default"
      :text="$t('Save')"
      prepend-icon="mdi-content-save"
      @click="addNotification"
    />
  </VForm>
</template>

<style scoped>

</style>