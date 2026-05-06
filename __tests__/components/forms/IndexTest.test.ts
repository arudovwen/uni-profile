import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import IndexTest from '@/components/forms/IndexTest.vue';
import SearchComponent from '@/components/forms/SearchComponent.vue';
import SelectComponent from '@/components/forms/SelectComponent.vue';

describe('IndexTest.vue', () => {
  it('renders children and handles data emission', async () => {
    const wrapper = mount(IndexTest, {
      global: {
        stubs: {
          SearchComponent: {
            name: 'SearchComponent',
            props: ['options'],
            template: '<div class="search-stub"></div>'
          },
          SelectComponent: {
            name: 'SelectComponent',
            props: ['options'],
            template: '<div class="select-stub"></div>'
          }
        }
      }
    });

    const search = wrapper.findComponent(SearchComponent);
    const select = wrapper.findComponent(SelectComponent);

    const expectedOptions = [
      { id: 1, name: "Wade Cooper" },
      { id: 2, name: "Arlene Mccoy" },
      { id: 3, name: "Devon Webb" },
      { id: 4, name: "Tom Cook" },
      { id: 5, name: "Tanya Fox" },
      { id: 6, name: "Hellen Schmidt" },
    ];

    expect(search.props('options')).toEqual(expectedOptions);
    expect(select.props('options')).toEqual(expectedOptions);

    await search.vm.$emit('onGetData', 'test-value');
    await select.vm.$emit('onGetData', 'test-value');

    expect(wrapper.classes()).toContain('p-20');
  });
});