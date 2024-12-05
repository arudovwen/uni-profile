import { render, screen } from '@testing-library/vue'
import {it, expect, describe} from "vitest";
import AccountType from "../components/onboarding/AccountType.vue";
import {mount} from "@vue/test-utils"
import AccordionComponent from "~/components/accordion/AccordionComponent.vue";

describe("AccordionComponnent", () => {
	it("renders", () => {
		const component = mount(AccordionComponent, {
			props: {
				items: [
					{
						title: "Item One"
					},
					{
						title: "Item Two"
					}
				]
			}
		});
		expect(component.html()).toContain("Item One");
		// await component.getBy(".justify-between").trigger("click");
		// expect (component.find(".font-normal")).not.toBe(null);
	})
})