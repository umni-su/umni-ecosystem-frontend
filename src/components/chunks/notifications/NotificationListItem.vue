<script>
import ModalDialog from '../ModalDialog.vue'
import ConfigurationDynamicField from '../configuration/ConfigurationDynamicField.vue'
import {createErrorNotification, createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'NotificationListItem',
  components: {ConfigurationDynamicField, ModalDialog},
  props: {
    notification:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      show:false,
      openTest: false,
      schema:null,
      editedOptions: {},
      queue:{
        to:null,
        subject:null,
        message:null,
        priority:2
      }
    }
  },
  computed: {
    loading(){
      return this.$store.getters['isLoading']
    },
    canSendTest(){
      return this.queue.message !== null
    }
  },
  methods: {
    async getSchema(){
      this.schema = await this.$store.dispatch('getNotificationSchema', this.notification.id)
      // Копируем текущие options для редактирования
      this.editedOptions = {...this.notification.options}
      this.show = true
    },

    saveChanges() {
      // Фильтруем sensitive поля: оставляем только измененные
      const finalOptions = this.processSensitiveFields(this.editedOptions, this.notification.options)

      // Отправляем на сервер
      this.$store.dispatch('updateNotification', {
        id: this.notification.id,
        options: finalOptions
      })

      this.show = false
    },

    processSensitiveFields(newOptions, originalOptions) {
      const result = {...newOptions}

      // Проходим по всем полям схемы
      Object.keys(this.schema.fields).forEach(fieldName => {
        const field = this.schema.fields[fieldName]

        if (field.is_sensitive) {
          const newValue = newOptions[fieldName]
          const originalValue = originalOptions[fieldName]

          // Если значение не изменилось (маска или оригинальное зашифрованное)
          if (newValue === '********' || newValue === originalValue) {
            // Сохраняем оригинальное зашифрованное значение
            result[fieldName] = originalValue
          }
          // Если введено новое значение - оно уже в result
        }
      })

      return result
    },
    async saveNotification(){
      const data = {...this.notification,...{options:this.editedOptions}}
      const res = await this.$store.dispatch('editNotification', data)
      if(res){
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
        this.show = false
      }
    },
    async sendTest(){
      const res = await this.$store.dispatch('sendNotification', {
        notification_id:this.notification.id,
        to:this.queue.to,
        subject:this.queue.subject,
        message:this.queue.message,
        priority:this.queue.priority
      }).catch(e=>{
        this.$store.commit('addNotification', createErrorNotification(e.response.data.detail))
      })
      if(res){
        this.$store.commit('addNotification', createSuccessNotification(res.message))
      }
    }
  }
}
</script>

<template>
  <VListItem
    :title="notification.name"
    :subtitle="notification.type_str"
  >
    <template #prepend>
      <VIcon
        :color="notification.active ? 'success' : 'error'"
        icon="mdi-circle"
      />
    </template>
    <template #append>
      <VBtn
        class="mr-1"
        icon="mdi-send"
        variant="plain"
        density="comfortable"
        size="small"
        @click="openTest = true"
      />
      <VBtn
        class="mr-1"
        color="default"
        icon="mdi-pencil"
        variant="plain"
        density="comfortable"
        size="small"
        @click="getSchema"
      />
      <VBtn
        color="error"
        icon="mdi-trash-can"
        variant="plain"
        density="comfortable"
        size="small"
      />
    </template>
    <template #default>
      <ModalDialog
        v-if="schema"
        v-model="show"
        :title="schema.model_description"
        @confirm="saveChanges"
      >
        <VTextField
          v-model="notification.name"
          class="mb-4"
          :label="$t('Name')"
        />
        <VSwitch
          v-model="notification.active"
          class="mb-4"
          :label="$t('Active')"
        />
        <VSheet
          v-for="(field, fieldName) in schema.fields"
          :key="fieldName"
          class="mb-4"
        >
          <ConfigurationDynamicField
            v-model="editedOptions[fieldName]"
            :field="field"
            :field-key="fieldName"
          />
        </VSheet>
        <template #actions>
          <VBtn
            prepend-icon="mdi-content-save"
            :text="$t('Save')"
            @click="saveNotification"
          />
        </template>
      </ModalDialog>
      <ModalDialog
        v-model="openTest"
        :title="$t('Отправить')"
      >
        <VTextField
          v-model="queue.to"
          :label="$t('To')"
        />
        <VTextField
          v-model="queue.subject"
          class="mt-4"
          :label="$t('Subject')"
        />
        <VTextarea
          v-model="queue.message"
          class="mt-4"
          :label="$t('Message')"
        />
        <template #actions>
          <VBtn
            :disabled="!canSendTest || loading"
            :loading="loading"
            :text="$t('Send')"
            prepend-icon="mdi-send"
            @click="sendTest"
          />
        </template>
      </ModalDialog>
    </template>
  </VListItem>
</template>