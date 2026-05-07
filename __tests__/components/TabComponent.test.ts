import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TabComponent from '@/components/TabComponent.vue';

describe('TabComponent.vue', () => {
  const detail = {
    title: 'Chemicals',
    marketColor: '#ff0000',
    imagePath: 'flask',
    productCount: 150,
    categoriesCount: 10
  };

  const globalOptions = {
    stubs: {
      'font-awesome-icon': {
        template: '<i class="fa-stub" :data-icon="JSON.stringify(icon)" :style="style"></i>',
        props: ['icon', 'style']
      }
    }
  };

  it('renders correctly with provided props', () => {
    const wrapper = mount(TabComponent, {
      props: { detail, index: 0, activeIndex: 1 },
      global: globalOptions
    });

    expect(wrapper.text()).toContain('Chemicals');
    expect(wrapper.text()).toContain('150 products');
    expect(wrapper.text()).toContain('10 subcategories');
    expect(wrapper.text()).toContain('01');
  });

  it('applies active styles when activeIndex matches index', () => {
    const wrapper = mount(TabComponent, {
      props: { detail, index: 2, activeIndex: 2 },
      global: globalOptions
    });

    const iconContainer = wrapper.find('.rounded-full.border');
    const iconStub = wrapper.find('.fa-stub');

    expect(iconContainer.attributes('style')).toContain('border-color: #ff0000');
    expect(iconStub.attributes('style')).toContain('color: #ff0000');
  });

  it('uses detail.imagePath for icon if provided', () => {
    const wrapper = mount(TabComponent, {
      props: { detail, index: 0, activeIndex: 0 },
      global: globalOptions
    });

    const iconStub = wrapper.find('.fa-stub');
    expect(iconStub.attributes('data-icon')).toContain('flask');
  });

  it('uses default box icon when imagePath is missing', () => {
    const detailNoImage = { ...detail, imagePath: null };
    const wrapper = mount(TabComponent, {
      props: { detail: detailNoImage, index: 0, activeIndex: 0 },
      global: globalOptions
    });

    const iconStub = wrapper.find('.fa-stub');
    expect(iconStub.attributes('data-icon')).toContain('box');
  });

  it('calculates numerical display correctly from index', () => {
    const wrapper = mount(TabComponent, {
      props: { detail, index: 8, activeIndex: 0 },
      global: globalOptions
    });

    expect(wrapper.find('span.text-\\[13px\\]').text()).toBe('09');
  });
});