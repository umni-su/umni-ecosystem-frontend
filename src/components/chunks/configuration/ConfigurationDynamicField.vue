<template>
  <div class="configuration-dynamic-field">
    <!-- Sensitive Field (password, token, etc.) -->
    <VTextField
      v-if="field.is_sensitive"
      v-model="displayValue"
      :label="field.description"
      :rules="fieldRules"
      variant="outlined"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      :clearable="!field.required"
      @click:append-inner="showPassword = !showPassword"
      @focus="onFocus"
      @blur="onBlur"
      @update:model-value="onSensitiveInput"
    >
      <template
        v-if="hasEncryptedValue && !isEditing"
        v-slot:append
      >
        <VIcon
          icon="mdi-lock"
          color="info"
          size="small"
        /></template>
    </VTextField>

    <!-- Text Input -->
    <VTextField
      v-else-if="field.ui_type === 'text'"
      v-model="localValue"
      :label="field.description"
      :rules="fieldRules"
      variant="outlined"
      :clearable="!field.required"
      @update:model-value="onInput"
    />

    <!-- Number Input -->
    <VTextField
      v-else-if="field.ui_type === 'number'"
      v-model.number="localValue"
      :label="field.description"
      :rules="fieldRules"
      variant="outlined"
      type="number"
      :min="field.constraints.min"
      :max="field.constraints.max"
      :step="field.type === 'integer' ? 1 : 0.1"
      @update:model-value="onInput"
    />

    <!-- Select/Dropdown -->
    <VSelect
      v-else-if="field.ui_type === 'select'"
      v-model="localValue"
      :label="field.description"
      :rules="fieldRules"
      variant="outlined"
      :items="field.constraints.options || []"
      item-title="label"
      item-value="value"
      :clearable="!field.required"
      @update:model-value="onInput"
    />

    <!-- Checkbox -->
    <VCheckbox
      v-else-if="field.ui_type === 'checkbox'"
      v-model="localValue"
      :label="field.description"
      persistent-hint
      :rules="fieldRules"
      color="primary"
      @update:model-value="onInput"
    />

    <!-- Email Input -->
    <VTextField
      v-else-if="field.ui_type === 'email'"
      v-model="localValue"
      :label="field.description"
      persistent-hint
      :rules="emailRules"
      variant="outlined"
      type="email"
      :clearable="!field.required"
      @update:model-value="onInput"
    />

    <!-- Textarea -->
    <VTextarea
      v-else-if="field.ui_type === 'textarea'"
      v-model="localValue"
      :label="field.description"
      persistent-hint
      :rules="fieldRules"
      variant="outlined"
      :rows="3"
      auto-grow
      :clearable="!field.required"
      @update:model-value="onInput"
    />

    <!-- Date Input -->
    <VTextField
      v-else-if="field.ui_type === 'date'"
      v-model="localValue"
      :label="field.description"
      persistent-hint
      :rules="fieldRules"
      variant="outlined"
      type="date"
      @update:model-value="onInput"
    />

    <!-- Unknown field type -->
    <VAlert
      v-else
      type="warning"
      variant="tonal"
    >
      {{$t('Unknown field type')}} {{ field.ui_type }}
    </VAlert>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationDynamicField',

  props: {
    field: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && typeof value === 'object' && 'ui_type' in value
      }
    },
    fieldKey: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object],
      default: null
    }
  },

  emits: ['update:modelValue'],

  data() {
    return {
      showPassword: false,
      localValue: this.modelValue,
      displayValue: '',
      isEditing: false
    }
  },

  computed: {
    // Проверяем, является ли значение зашифрованным
    hasEncryptedValue() {
      return this.field.is_sensitive &&
          typeof this.modelValue === 'string' &&
          this.modelValue.startsWith('gAAAAA')
    },

    // Базовые правила валидации
    fieldRules() {
      const rules = []

      // Обязательное поле
      if (this.field.required) {
        rules.push(value => !!value || `Поле "${this.field.description}" обязательно для заполнения`)
      }

      // Для sensitive полей с зашифрованным значением не требуем заполнения
      if (this.field.is_sensitive && this.hasEncryptedValue) {
        // Если есть зашифрованное значение, поле не обязательно
        // Пользователь может оставить маску чтобы сохранить текущее значение
      } else if (this.field.required) {
        rules.push(value => !!value || `Поле "${this.field.description}" обязательно для заполнения`)
      }

      // Минимальная длина для строк
      if (this.field.constraints.minLength && this.field.type === 'string') {
        rules.push(value => !value || value.length >= this.field.constraints.minLength ||
            `Минимальная длина: ${this.field.constraints.minLength} символов`)
      }

      // Максимальная длина для строк
      if (this.field.constraints.maxLength && this.field.type === 'string') {
        rules.push(value => !value || value.length <= this.field.constraints.maxLength ||
            `Максимальная длина: ${this.field.constraints.maxLength} символов`)
      }

      // Минимальное значение для чисел
      if (this.field.constraints.min !== undefined && (this.field.type === 'integer' || this.field.type === 'number')) {
        rules.push(value => value === null || value === '' || value >= this.field.constraints.min ||
            `Минимальное значение: ${this.field.constraints.min}`)
      }

      // Максимальное значение для чисел
      if (this.field.constraints.max !== undefined && (this.field.type === 'integer' || this.field.type === 'number')) {
        rules.push(value => value === null || value === '' || value <= this.field.constraints.max ||
            `Максимальное значение: ${this.field.constraints.max}`)
      }

      return rules
    },

    // Специальные правила для email
    emailRules() {
      const rules = this.fieldRules

      // Добавляем валидацию email
      if (this.field.ui_type === 'email') {
        rules.push(value => !value || /.+@.+\..+/.test(value) || 'Некорректный email адрес')
      }

      return rules
    }
  },

  watch: {
    // Следим за изменением внешнего значения
    modelValue(newVal) {
      if (this.field.is_sensitive) {
        if (this.hasEncryptedValue && !this.isEditing) {
          this.displayValue = '********'
        } else {
          this.displayValue = newVal || ''
        }
      } else {
        this.localValue = newVal
      }
    }
  },

  mounted() {
    // Инициализируем displayValue для sensitive полей
    if (this.field.is_sensitive) {
      if (this.hasEncryptedValue) {
        this.displayValue = '********'
      } else {
        this.displayValue = this.modelValue || ''
      }
    }
  },

  methods: {
    onInput(value) {
      this.$emit('update:modelValue', value)
    },

    onSensitiveInput(value) {
      // Для sensitive полей:
      // - Если введено '********' - игнорируем (сохраняем текущее зашифрованное значение)
      // - Если введено что-то другое - отправляем новое значение
      if (value !== '********') {
        this.$emit('update:modelValue', value)
      } else if (this.hasEncryptedValue) {
        // Явно отправляем текущее зашифрованное значение
        this.$emit('update:modelValue', this.modelValue)
      }
    },

    onFocus() {
      this.isEditing = true
      if (this.field.is_sensitive && this.hasEncryptedValue) {
        this.displayValue = '' // Очищаем при фокусе для ввода нового значения
      }
    },

    onBlur() {
      this.isEditing = false
      if (this.field.is_sensitive && this.hasEncryptedValue && !this.displayValue) {
        this.displayValue = '********' // Возвращаем маску если ничего не ввели
      }
    },

    // Валидация поля
    validate() {
      return this.$refs.form ? this.$refs.form.validate() : true
    },

    // Сброс валидации
    resetValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    }
  }
}
</script>

<style scoped>
.configuration-dynamic-field {
  width: 100%;
}
</style>