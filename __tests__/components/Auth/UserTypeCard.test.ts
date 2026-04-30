import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserTypeCard from '@/components/Auth/UserTypeCard.vue';
import AuthClientIconActive from '@/components/Auth/ClientIconActive.vue';
import AuthClientIcon from '@/components/Auth/ClientIcon.vue';
import AuthVendorIconActive from '@/components/Auth/VendorIconActive.vue';
import AuthVendorIcon from '@/components/Auth/VendorIcon.vue';

describe('UserTypeCard.vue', () => {
  it('renders title and description correctly', () => {
    const wrapper = mount(UserTypeCard, {
      props: {
        title: 'Client',
        description: 'Standard client account',
        active: false
      }
    });

    expect(wrapper.text()).toContain('Client');
    expect(wrapper.text()).toContain('Standard client account');
  });

  it('emits click event on click', async () => {
    const wrapper = mount(UserTypeCard);
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('applies active border class when active prop is true', () => {
    const wrapper = mount(UserTypeCard, {
      props: { active: true }
    });
    expect(wrapper.classes()).toContain('border-[#80B0FF]');
  });

  it('renders Client icons based on active state', async () => {
    const wrapper = mount(UserTypeCard, {
      props: {
        active: false,
        iconActive: 'AuthClientIconActive',
        iconInactive: 'AuthClientIcon'
      }
    });

    expect(wrapper.findComponent(AuthClientIcon).exists()).toBe(true);

    await wrapper.setProps({ active: true });
    expect(wrapper.findComponent(AuthClientIconActive).exists()).toBe(true);
  });

  it('renders Vendor icons based on active state', async () => {
    const wrapper = mount(UserTypeCard, {
      props: {
        active: false,
        iconActive: 'AuthVendorIconActive',
        iconInactive: 'AuthVendorIcon'
      }
    });

    expect(wrapper.findComponent(AuthVendorIcon).exists()).toBe(true);

    await wrapper.setProps({ active: true });
    expect(wrapper.findComponent(AuthVendorIconActive).exists()).toBe(true);
  });

  it('handles default computed branches for icons', () => {
    const wrapper = mount(UserTypeCard, {
      props: {
        active: false,
        iconActive: 'Other',
        iconInactive: 'Other'
      }
    });
    
    expect(wrapper.findComponent(AuthVendorIcon).exists()).toBe(true);
    
    const activeWrapper = mount(UserTypeCard, {
      props: {
        active: true,
        iconActive: 'Other'
      }
    });
    expect(activeWrapper.findComponent(AuthVendorIconActive).exists()).toBe(true);
  });
});