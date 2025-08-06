<script>
import UmniLogo from './UmniLogo.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import {createErrorNotification, createManyNotifications} from '../../js/helpers/notificationHelper.js'

export default {
  name: 'InstallForm',
  components: {ThemeSwitcher, UmniLogo},
  emits: ['on-account-updated'],
  data() {
    return {
      step: 1,
      canInstall: false,
      showPassword: false,
      account: {
        firstname: null,
        lastname: null,
        username: null,
        email: null,
        password: null,
        passwordConfirm: null
      },
      mqtt: {
        port: 1883,
        host: '127.0.0.1',
        user: null,
        password: null
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters['isLoading']
    },
    theme() {
      return this.$store.getters['getTheme']
    }
  },
  watch: {
    account: {
      deep: true,
      handler() {
        this.$emit('on-account-updated', this.account)
      }
    },
    mqtt: {
      deep: true,
      handler() {
        this.canInstall = false
      }
    }
  },
  methods: {
    async checkMqttConnection() {
      const res = await this.$store.dispatch('checkMqttConnection', this.mqtt).catch(e => {
        this.canInstall = false
        this.$store.commit('addNotification', createErrorNotification(this.$t('Error to connect. Please check your credentials or MQTT broker settings.')))
      })
      if (res) {
        this.canInstall = true
      }
    },
    async installEcosystem() {
      const data = {
        account: this.account,
        mqtt: this.mqtt
      }
      const ok = await this.$store.dispatch('install', data).catch(e => {
        console.log(e.response.data.error)
        this.$store.commit('addNotification', createManyNotifications('error', e.response.data.error))
      })
    }
  }
}
</script>

<template>
  <VSheet
    class="fill-height w-100 d-flex align-center justify-center"
  >
    <VCard
      variant="tonal"
      :color="theme === 'light' ? 'primary' : 'primary-darken'"
      max-width="400"
      width="100%"
      class="ma-auto"
    >
      <VCardTitle class="text-center mt-6">
        <UmniLogo
          :fill="theme === 'light' ? '#0486c2' : '#0486c2'"
          :size="60"
        />
      </VCardTitle>
      <VCardTitle
        v-if="step === 1"
        class="text-center"
      >
        {{ $t('Account settings') }}
      </VCardTitle>
      <VCardTitle
        v-if="step === 2"
        class="text-center"
      >
        {{ $t('MQTT settings') }}
      </VCardTitle>
      <VCardText>
        <VWindow
          v-model="step"
          class="pt-4"
        >
          <VWindowItem
            :value="1"
          >
            <VForm>
              <VTextField
                v-model="account.firstname"
                autocomplete="off"
                class="mb-4"
                :label="$t('Firstname')"
              />
              <VTextField
                v-model="account.lastname"
                autocomplete="off"
                class="mb-4"
                :label="$t('Lastname')"
              />
              <VTextField
                v-model="account.email"
                autocomplete="off"
                class="mb-4"
                :label="$t('Email')"
              />
              <VTextField
                v-model="account.username"
                autocomplete="off"
                class="mb-4"
                :label="$t('Username')"
              />
              <VTextField
                v-model="account.password"
                autocomplete="off"
                :type="showPassword ? 'text' : 'password'"
                class="mb-4"
                :label="$t('Password')"
              >
                <template #append-inner>
                  <VBtn
                    color="default"
                    variant="plain"
                    density="comfortable"
                    :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </VTextField>
              <VTextField
                v-model="account.passwordConfirm"
                color="default"
                autocomplete="off"
                :type="showPassword ? 'text' : 'password'"
                class="mb-4"
                :label="$t('Password confirmation')"
              />
            </VForm>
          </VWindowItem>
          <VWindowItem :value="2">
            <VForm>
              <VTextField
                v-model="mqtt.host"
                autocomplete="off"
                class="mb-4"
                :label="$t('Host')"
              />
              <VTextField
                v-model.number="mqtt.port"
                autocomplete="off"
                class="mb-4"
                :label="$t('Host')"
              />
              <VTextField
                v-model.number="mqtt.user"
                autocomplete="off"
                class="mb-4"
                :label="$t('User')"
              />
              <VTextField
                v-model.number="mqtt.password"
                autocomplete="off"
                type="password"
                class="mb-4"
                :label="$t('Password')"
              />
            </VForm>
          </VWindowItem>
        </VWindow>
      </VCardText>
      <VCardActions v-show="step === 1">
        <VSpacer />
        <VBtn
          color="default"
          variant="plain"
          :text="$t('Next')"
          append-icon="mdi-chevron-right"
          @click="step =2"
        />
      </VCardActions>
      <VCardActions v-show="step === 2">
        <VBtn
          density="comfortable"
          color="default"
          variant="plain"
          icon="mdi-chevron-left"
          @click="step = 1"
        />
        <VSpacer />
        <VBtn
          v-if="canInstall"
          color="default"
          variant="plain"
          :text="$t('Install')"
          prepend-icon="mdi-send"
          @click="installEcosystem"
        />
        <VBtn
          v-else
          :loading="loading"
          :disabled="loading"
          color="default"
          variant="plain"
          :text="$t('Check')"
          prepend-icon="mdi-checkbox-blank-circle-outline"
          @click="checkMqttConnection"
        />
      </VCardActions>
    </VCard>
    <VSheet class="pa-4 bottom-nav">
      <VBtn
        color="default"
        variant="plain"
        :disabled="step === 1"
        :text="$t('Account settings')"
        icon="mdi-chevron-left"
        @click="step = 1"
      />
      <ThemeSwitcher
        density="comfortable"
        class="mx-3"
      />

      <VBtn
        color="default"
        variant="plain"
        :disabled="step === 2"
        :text="$t('MQTT settings')"
        icon="mdi-chevron-right"
        @click="step = 2"
      />
    </VSheet>
  </VSheet>
</template>

<style lang="scss" scoped>
.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
