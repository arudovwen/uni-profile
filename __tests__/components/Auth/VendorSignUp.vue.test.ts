import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import VendorSignUp from '~/components/Auth/VendorSignUp.vue';
import { registerUser, confirmRegister } from "~/services/authservices";
import { toast } from "vue3-toastify";

const mockRoute = {
  params: { app: 'MAT460', auth: 'vendor' },
  query: {}
};

const mockRouter = {
  push: vi.fn()
};

const headSpy = vi.fn();
const redirectSpy = vi.fn();
const routingSpy = vi.fn(() => '/login');
const cookieVal = { value: null };

vi.mock('~/services/authservices', () => ({
  registerUser: vi.fn(),
  confirmRegister: vi.fn()
}));

vi.mock('vue3-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn() }
}));

vi.mock('~/utils/saveAuthProfile', () => ({
  saveAuthProfile: vi.fn()
}));

vi.stubGlobal('useRoute', () => mockRoute);
vi.stubGlobal('useRouter', () => mockRouter);
vi.stubGlobal('useHead', headSpy);
vi.stubGlobal('useEncryptedCookie', () => cookieVal);
vi.stubGlobal('appCodeColorMap', { 'MAT460': '#000', 'FLU722': '#fff' });
vi.stubGlobal('handleRouting', routingSpy);
vi.stubGlobal('handleRedirect', redirectSpy);
vi.stubGlobal('intialRoute', { 'buyer': '/dashboard' });
vi.stubGlobal('defaultOptions', {});
vi.stubGlobal('getCountryFromBrowserRegion', () => 'Nigeria');

describe('VendorSignUp Component', () => {
  let wrapper;

  const createComponent = () => {
    return mount(VendorSignUp, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          NuxtLayout: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' },
          Textinput: {
            name: 'Textinput',
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          PhoneNumber: { name: 'PhoneNumber', template: '<div />' },
          SelectVueSelect: { name: 'SelectVueSelect', template: '<div />' },
          FormGroup: { name: 'FormGroup', template: '<div><slot /></div>' },
          Checkbox: { name: 'Checkbox', template: '<div />' },
          AppButton: {
            name: 'AppButton',
            template: '<button :disabled="isDisabled"><slot /></button>',
            props: ['isDisabled']
          },
          AuthOtp: {
            name: 'AuthOtp',
            template: '<div id="otp-stub" @handleSubmit="$emit(\'handleSubmit\', \'123456\')"></div>',
            props: ['email']
          }
        }
      }
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.query = {};
    mockRoute.params = { app: 'MAT460', auth: 'vendor' };
    cookieVal.value = null;
  });

  it('renders sign up form initially', async () => {
    wrapper = createComponent();
    await nextTick();
    expect(wrapper.text()).toContain('Sign Up');
    expect(wrapper.vm.step).toBe(1);
  });

  it('computes allcountries from json', () => {
    wrapper = createComponent();
    expect(wrapper.vm.allcountries).toBeDefined();
    expect(wrapper.vm.allcountries.length).toBeGreaterThan(0);
  });

  it('submits step 1 successfully', async () => {
    registerUser.mockResolvedValue({ status: 200 });
    wrapper = createComponent();
    
    wrapper.vm.firstName = 'John';
    wrapper.vm.lastName = 'Doe';
    wrapper.vm.email = 'john@doe.com';
    wrapper.vm.phoneNumber = '1234567890';
    wrapper.vm.password = 'Password123!';
    wrapper.vm.country = 'Nigeria';
    wrapper.vm.agree = true;

    await wrapper.vm.onSubmit();
    await flushPromises();

    expect(registerUser).toHaveBeenCalled();
    expect(wrapper.vm.step).toBe(2);
  });
  it('handles final OTP submission error', async () => {
    confirmRegister.mockRejectedValue({
      response: { data: { Message: 'Invalid OTP' } }
    });
    wrapper = createComponent();
    
    await wrapper.vm.handleFinalSubmit('000000');
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith('Invalid OTP');
  });

  it('sets phoneError when PhoneNumber emits error', () => {
    wrapper = createComponent();
    const phoneComp = wrapper.findComponent({ name: 'PhoneNumber' });
    phoneComp.vm.$emit('setError', 'Invalid number');
    expect(wrapper.vm.phoneError).toBe('Invalid number');
  });
});