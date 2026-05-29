import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AdminAppsManagement from '@/components/AdminAppsManagement.vue';
import { getSubApps } from '~/services/userservices';

vi.mock('~/services/userservices', () => ({
  getSubApps: vi.fn()
}));

const mockToast = {
  info: vi.fn(),
  error: vi.fn(),
  success: vi.fn()
};

vi.mock('~/composables/useToast', () => ({
  useToast: () => mockToast
}));

const mockAuthStore = {
  userInfo: { companyName: 'Test Company', userCategory: 1 },
  jwToken: 'token123',
  refreshToken: 'refresh123',
  loggedUser: { email: 'test@example.com' }
};

vi.mock('#imports', () => ({
  useAuthStore: () => mockAuthStore,
  buildAuthUrl: vi.fn(() => 'https://auth.mock.url')
}));

vi.mock('~/composables/useEncryption', () => ({
  useEncryption: () => ({
    encrypt: vi.fn((val) => `enc_${val}`),
    decrypt: vi.fn((val) => val.replace('enc_', ''))
  })
}));

const mockSignupFn = vi.fn();

vi.mock('~/composables/useOnboarding', () => ({
  useOnboarding: () => ({
    getSignupFunction: vi.fn(() => mockSignupFn),
    buildAppPayload: vi.fn(() => ({}))
  })
}));

vi.mock('~/utils/app-config', () => ({
  APP_CODES: {
    OXIDE_PRO: { code: 'OXIDE_PRO' },
    ORBITAL: { code: 'ORBITAL' },
    OXIDE: { code: 'OXIDE' },
    FLUX: { code: 'FLUX' },
    MATTA: { code: 'MATTA' },
    MATTAPEDIA: { code: 'MATTAPEDIA' }
  }
}));

describe('AdminAppsManagement.vue', () => {
  let mockWindow: any;
  let windowOpenSpy: any;
  let mockLink: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLink = {
      href: '',
      rel: '',
      click: vi.fn()
    };

    mockWindow = {
      document: {
        write: vi.fn(),
        getElementById: vi.fn(() => ({ textContent: '' })),
        createElement: vi.fn(() => mockLink),
        body: { appendChild: vi.fn() },
        title: ''
      },
      closed: false,
      close: vi.fn(),
      opener: {}
    };

    windowOpenSpy = vi.spyOn(window, 'open').mockReturnValue(mockWindow);
    mockAuthStore.userInfo = { companyName: 'Test Company', userCategory: 1 };
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  const createWrapper = () => {
    return mount(AdminAppsManagement, {
      global: {
        stubs: ['AdminAppsCard', 'ComputerSvg', 'ApplicationModal']
      }
    });
  };

  it('renders loading state initially and handles successful app loading', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (getSubApps as any).mockReturnValueOnce(promise);

    const wrapper = createWrapper();
    
    resolvePromise({
      status: 200,
      data: {
        data: [
          { id: '1', code: 'FLUX', name: 'Flux App' },
          { id: '2', code: 'OXIDE', name: 'Oxide App', description: 'Desc', url: 'https://url' }
        ]
      }
    });
    await flushPromises();

    expect(wrapper.findAll('admin-apps-card-stub').length).toBe(2);
  });

  it('handles app loading failure gracefully', async () => {
    (getSubApps as any).mockRejectedValueOnce(new Error('API Error'));

    const wrapper = createWrapper();
    await flushPromises();

    expect(mockToast.error).toHaveBeenCalledWith('Failed to load applications');
    expect(wrapper.text()).toContain('No applications available.');
  });

  it('handles default slug when user info is missing', async () => {
    mockAuthStore.userInfo = null as any;
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });

    createWrapper();
    await flushPromises();
  });

  it('opens and closes the Add Application modal', async () => {
    (getSubApps as any).mockResolvedValueOnce({
      status: 200,
      data: { data: [{ id: '1', code: 'MATTA', name: 'Matta' }] }
    });
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.find('div.font-Avenir').trigger('click');
    expect(wrapper.vm.isApplicationModalOpen).toBe(true);
    expect(wrapper.vm.selectedApp).toBeNull();

    wrapper.vm.closeApplicationModal();
    expect(wrapper.vm.isApplicationModalOpen).toBe(false);
  });

  it('opens Edit Application modal and handles application submit', async () => {
    (getSubApps as any).mockResolvedValue({ status: 200, data: { data: [] } });
    const wrapper = createWrapper();
    await flushPromises();

    const mockApp = { id: '1', name: 'App' };
    wrapper.vm.handleEditApp(mockApp);
    
    expect(wrapper.vm.isApplicationModalOpen).toBe(true);
    expect(wrapper.vm.selectedApp).toEqual(mockApp);

    await wrapper.vm.handleApplicationSubmit();
    expect(getSubApps).toHaveBeenCalledTimes(2);
  });

  it('manages the delete confirmation modal flow successfully', async () => {
    (getSubApps as any).mockResolvedValue({ status: 200, data: { data: [] } });
    const wrapper = createWrapper();
    await flushPromises();

    const mockApp = { id: '1', name: 'DeleteMe' };
    wrapper.vm.handleDeleteApp(mockApp);
    
    expect(wrapper.vm.isDeleteOpen).toBe(true);
    expect(wrapper.vm.selectedAppForDelete).toEqual(mockApp);

    await wrapper.vm.confirmDelete();
    
    expect(mockToast.success).toHaveBeenCalledWith('Application deleted successfully');
    expect(wrapper.vm.isDeleteOpen).toBe(false);
    expect(getSubApps).toHaveBeenCalledTimes(2);

    wrapper.vm.handleDeleteApp(mockApp);
    wrapper.vm.closeDeleteModal();
    expect(wrapper.vm.isDeleteOpen).toBe(false);
  });

  it('aborts delete confirmation if no app is selected', async () => {
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.selectedAppForDelete = null;
    await wrapper.vm.confirmDelete();
    expect(mockToast.success).not.toHaveBeenCalled();
  });

  it('blocks navigation for unallowed admin apps', async () => {
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.navigateToApp({ code: 'INVALID', name: 'Invalid App' });
    expect(mockToast.info).toHaveBeenCalledWith('Invalid App Admin is not available');
  });

  it('aborts navigation if app has no url', async () => {
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.navigateToApp({ code: 'FLUX', url: null });
    expect(windowOpenSpy).not.toHaveBeenCalled();
  });

  it('navigates to app successfully with active window', async () => {
    mockSignupFn.mockResolvedValueOnce({});
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.navigateToApp({ code: 'FLUX', url: 'https://valid.url', name: 'Flux' });
    await flushPromises();

    expect(windowOpenSpy).toHaveBeenCalledWith('about:blank', '_blank');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('navigates to app successfully with closed window fallback', async () => {
    mockSignupFn.mockResolvedValueOnce({});
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    
    const wrapper = createWrapper();
    await flushPromises();

    mockWindow.closed = true;
    
    await wrapper.vm.navigateToApp({ code: 'FLUX', url: 'https://valid.url', name: 'Flux' });
    await flushPromises();

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      expect.stringContaining('auth/validate'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('handles navigation error containing Already a with active window', async () => {
    mockSignupFn.mockRejectedValueOnce({ response: { data: { message: 'Already a member' } } });
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.navigateToApp({ code: 'FLUX', url: 'https://valid.url', name: 'Flux' });
    await flushPromises();

    expect(mockLink.click).toHaveBeenCalled();
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('handles navigation error containing Already a with closed window', async () => {
    mockSignupFn.mockRejectedValueOnce({ response: { data: { message: 'Already a member' } } });
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    
    const wrapper = createWrapper();
    await flushPromises();

    mockWindow.closed = true;

    await wrapper.vm.navigateToApp({ code: 'FLUX', url: 'https://valid.url', name: 'Flux' });
    await flushPromises();

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      expect.stringContaining('auth/validate'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('handles generic navigation error and closes window', async () => {
    mockSignupFn.mockRejectedValueOnce({ response: { data: { message: 'Custom API Error' } } });
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.navigateToApp({ code: 'FLUX', url: 'https://valid.url', name: 'Flux' });
    await flushPromises();

    expect(mockWindow.close).toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith('Custom API Error');
  });

  it('handles generic navigation error when window is null', async () => {
    windowOpenSpy.mockReturnValue(null);
    mockSignupFn.mockRejectedValueOnce(new Error('Unknown'));
    (getSubApps as any).mockResolvedValueOnce({ status: 200, data: { data: [] } });
    
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.navigateToApp({ code: 'FLUX', url: 'https://valid.url', name: 'Flux' });
    await flushPromises();

    expect(mockToast.error).toHaveBeenCalledWith('Failed to open the application. Please try again.');
  });
});