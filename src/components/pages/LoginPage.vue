<script>
import UmniLogo from '../../components/chunks/UmniLogo.vue'
import {createErrorNotification} from '../../js/helpers/notificationHelper.js'

export default {
  name: 'LoginPage',
  components: {
    UmniLogo
  },
  data: () => {
    return {
      username: null,
      password: null
    }
  },
  computed: {
    theme() {
      return this.$store.getters['getTheme']
    },
    loading() {
      return this.$store.getters['isLoading']
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('logIn', {
        username: this.username,
        password: this.password
      }).catch(e => {
        this.$store.commit('addNotification', createErrorNotification(this.$t(e.response.data.detail)))
      })
    }
  }
}

</script>

<template>
  <VLayout
    class="login bg-primary"
  >
    <VSheet
      width="500"
      rounded="0"
      class="login-sheet fill-height d-flex justify-center align-center"
    >
      <VCard
        rounded="0"
        width="350"
        class="py-3 px-8"
        elevation="0"
        variant="text"
      >
        <template #text>
          <UmniLogo
            :short="false"
            :width="210"
            class="d-block opacity-70 ma-auto mb-4"
          />
          <VForm @keydown.enter="login">
            <VTextField
              v-model="username"
              :label="$t('Username')"
              class="mb-4"
              autocomplete="off"
              prepend-inner-icon="mdi-account"
            />
            <VTextField
              v-model="password"
              autocomplete="off"
              :label="$t('Password')"
              type="password"
              class="mb-4"
              prepend-inner-icon="mdi-key"
            />
            <VBtn
              variant="tonal"
              color="default"
              :loading="loading"
              :disabled="loading"
              class="w-100"
              :text="$t('Login')"
              prepend-icon="mdi-send"
              size="large"
              @click="login"
            />
          </VForm>
        </template>
      </VCard>
      <div class="mini-slog text-body-small opacity-50">
        {{ $t('Prostoy. Dostupniy. Umni.') }}
      </div>
    </VSheet>
    <div class="position-absolute right-0 bottom-0 pa-6">
      <VBtn
        variant="plain"
        color="default"
        icon="mdi-web"
        href="https://umni.su/"
        target="_blank"
      />
      <VBtn
        variant="plain"
        color="default"
        icon="mdi-book"
        href="https://docs.umni.su/"
        target="_blank"
      />
      <VBtn
        variant="plain"
        color="default"
        icon="mdi-github"
        href="https://github.com/umni-su"
        target="_blank"
      />

    </div>
  </VLayout>
</template>

<style scoped>

.login {
  display: flex;
  align-items: center;
  justify-content: start;
  background: url("../../assets/img/eco-bg.jpg") no-repeat 0 center;
  background-size: cover;

  .login-sheet {
    position: relative;
    background: rgba(3, 80, 108, 0.4);

    .mini-slog {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      text-align: center;
    }
  }
}
</style>
