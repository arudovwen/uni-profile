import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import BusinessIndex from '@/components/Pages/Business/index.vue';
import { getBusinessProfile } from "~/services/settingservices";

vi.mock('~/services/settingservices', () => ({
  getBusinessProfile: vi.fn()
}));

const KybDocumentDefault = [
  { documentType: 0, url: "", urls: [{ url: "" }] },
  { documentType: 1, url: "", urls: [{ url: "" }] },
  { documentType: 2, url: "", urls: [{ url: "" }] },
  { documentType: 3, url: "", urls: [{ url: "" }] },
  { documentType: 4, url: "", urls: [{ url: "" }] }
];
vi.stubGlobal('KybDocumentDefault', KybDocumentDefault);

const formData = { kyb: { companyDocuments: [] } };
vi.stubGlobal('formData', formData);

describe('BusinessIndex.vue', () => {
  const mockResponse = {
    status: 200,
    data: {
      data: {
        companyName: 'Test Corp',
        country: 'Nigeria',
        dateOfIncorporation: '2020-01-01',
        companyDocuments: [
          { documentType: 0, urls: [{ url: 'test.com/1' }], url: 'test.com/1' },
          { documentType: 1, urls: [], url: 'test.com/2' }
        ]
      }
    }
  };

  const globalOptions = {
    stubs: {
      HeaderComponent: true,
      AppLoader: { template: '<div class="loader-stub"></div>' },
      LazyPagesBusinessCompanyInformation: { template: '<div id="info"></div>' },
      LazyPagesBusinessCompanyDocuments: { template: '<div id="docs"></div>' },
      LazyPagesBusinessCompanyDirectors: { template: '<div id="directors"></div>' }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    formData.kyb.companyDocuments = [];
  });

  it('fetches and processes business profile on mount (Nigeria)', async () => {
    getBusinessProfile.mockResolvedValueOnce(mockResponse);
    const wrapper = mount(BusinessIndex, { global: globalOptions });

    await vi.waitFor(() => expect(wrapper.vm.isLoading).toBe(false));

    expect(wrapper.vm.companyInfo.companyName).toBe('Test Corp');
    expect(formData.kyb.companyDocuments).toHaveLength(2);
  });

  it('filters documents for non-Nigeria countries', async () => {
    const foreignResponse = {
      status: 200,
      data: {
        data: {
          country: 'Ghana',
          companyDocuments: [
            { documentType: 0, urls: [{ url: 'u1' }] },
            { documentType: 1, urls: [{ url: 'u2' }] }
          ]
        }
      }
    };
    getBusinessProfile.mockResolvedValueOnce(foreignResponse);
    mount(BusinessIndex, { global: globalOptions });

    await vi.waitFor(() => expect(formData.kyb.companyDocuments).toHaveLength(1));
    expect(formData.kyb.companyDocuments[0].documentType).toBe(0);
  });

  it('uses default documents when companyDocuments is empty', async () => {
    const emptyDocsResponse = {
      status: 200,
      data: {
        data: { country: 'Nigeria', companyDocuments: [] }
      }
    };
    getBusinessProfile.mockResolvedValueOnce(emptyDocsResponse);
    const wrapper = mount(BusinessIndex, { global: globalOptions });

    await vi.waitFor(() => expect(wrapper.vm.isLoading).toBe(false));
    expect(wrapper.vm.companyInfo.companyDocuments).toEqual(KybDocumentDefault);
  });

  it('handles API error gracefully', async () => {
    getBusinessProfile.mockRejectedValueOnce(new Error('API Error'));
    const wrapper = mount(BusinessIndex, { global: globalOptions });

    await vi.waitFor(() => expect(wrapper.vm.isLoading).toBe(false));
    expect(wrapper.vm.isLoading).toBe(false);
  });
});