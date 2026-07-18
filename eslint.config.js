// eslint.config.js
import vuePlugin from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

export default [
  // Добавляем базовые игнорирования
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/*.d.ts'
    ]
  },
  // Конфигурация для Vue файлов
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: vueParser
     
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      // Vue-specific rules
      'vue/html-self-closing': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'ignore',
        multiline: 'below'
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: 1,
        multiline: 1
      }],
      'vue/attributes-order': ['error', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: false
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always'
      }],
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true
      }],
      // JavaScript rules
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2]
    }
  },
  // Конфигурация для JS файлов
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'max-len': ['error', {
        code: 130,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true
      }]
    }
  }
]