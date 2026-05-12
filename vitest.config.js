import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    pool: 'forks',
    environmentOptions: {
      nuxt: {
        overrides: {
          googleSignIn: {
            clientId: 'test-client-id.apps.googleusercontent.com',
          },
        },
      },
    },
    setupFiles: './test.setup.js',
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'components/**/*.{js,ts,vue}',
        'pages/**/*.vue',
        'utils/*.js',
        'services/*.js',
        'layouts/*.vue',
        'middleware/*.js',
      ],
      exclude: [
        'plugins/**',
        '__tests__/**',
        '__tests__/',
        '__mocks__/**',
        'node_modules/',
        'coverage/',
				"utils/constants.js"
      ],
    },
    moduleNameMapper: {
      '^@vue3-clipboard/vue3-clipboard$': '<rootDir>/__mocks__/vue3-clipboard.mock.js',
    },
  },
});
