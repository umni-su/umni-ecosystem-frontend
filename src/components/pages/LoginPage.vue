<script>
import UmniLogo from "../../components/chunks/UmniLogo.vue";
import {createErrorNotification} from "../../js/helpers/notificationHelper.js";

export default {
  name: 'LoginPage',
  components: {UmniLogo},
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
        this.$store.commit('addNotification', createErrorNotification(this.$t(e.response.data.message)))
      })
    }
  }
}

</script>

<template>
  <VLayout
    class="login"
    :class="theme ==='light' ?'bg-primary' : 'bg-primary-darken'"
  >
    <VCard
      width="300"
    >
      <template #text>
        <UmniLogo
          :short="false"
          :width="250"
          class="d-block ma-auto mb-2"
          color="#0486c2"
        />
        <VTextField
          v-model="username"
          :label="$t('Username')"
          class="mb-4"
          prepend-inner-icon="mdi-account"
        />
        <VTextField
          v-model="password"
          :label="$t('Password')"
          type="password"
          class="mb-4"
          prepend-inner-icon="mdi-key"
        />
        <VBtn
          :loading="loading"
          :disabled="loading"
          class="w-100"
          :text="$t('Login')"
          prepend-icon="mdi-send"
          color="primary-darken"
          @click="login"
        />
      </template>
    </VCard>
    <div class="mini-slog">
      {{ $t('Prostoy. Dostupniy. Umni.') }}
    </div>
  </VLayout>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;

  .mini-slog {
    position: absolute;
    opacity: 0.5;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
