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
      canInstall: true,
      showPassword: false,
      account: {
        firstname: null,
        lastname: null,
        username: null,
        email: null,
        password: null,
        passwordConfirm: null
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
    }
  },
  methods: {
    async installEcosystem() {
      const data = {
        account: this.account
      }
      await this.$store.dispatch('install', data).catch(e => {
        this.$store.commit('addNotification', createManyNotifications('error', e.response.data.errors))
      })
    }
  }
}
</script>

<template>
  <VSheet
    color="transparent"
    class="fill-height w-100 d-flex align-center justify-center"
  >
    <VCard
      color="primary"
      max-width="400"
      width="100%"
      class="ma-auto"
    >
      <VCardTitle class="text-center mt-6">
        <UmniLogo
          fill="#ffffff"
          :short="false"
          :width="240"
        />
      </VCardTitle>
      <VCardTitle
        class="text-center"
      >
        {{ $t('Account settings') }}
      </VCardTitle>
      <VCardText>
        <VWindow
          class="pt-4"
        >
          <VWindowItem>
            <VForm>
              <VTextField
                v-model="account.firstname"
                autocomplete="new-password"
                inputmode="none"
                class="mb-4"
                :label="$t('Firstname')"
              />
              <VTextField
                v-model="account.lastname"
                autocomplete="new-password"
                inputmode="none"
                class="mb-4"
                :label="$t('Lastname')"
              />
              <VTextField
                v-model="account.email"
                autocomplete="new-password"
                inputmode="none"
                class="mb-4"
                :label="$t('Email')"
              />
              <VTextField
                v-model="account.username"
                autocomplete="new-password"
                inputmode="none"
                class="mb-4"
                :label="$t('Username')"
              />
              <VTextField
                v-model="account.password"
                autocomplete="new-password"
                inputmode="none"
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
                autocomplete="new-password"
                inputmode="none"
                :type="showPassword ? 'text' : 'password'"
                class="mb-4"
                :label="$t('Password confirmation')"
              />
            </VForm>
          </VWindowItem>
        </VWindow>
      </VCardText>

      <VCardActions class="text-center">
        <VBtn
          color="default"
          variant="tonal"
          size="large"
          block
          :text="$t('Install')"
          prepend-icon="mdi-send"
          @click="installEcosystem"
        />
      </VCardActions>
    </VCard>
    
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
