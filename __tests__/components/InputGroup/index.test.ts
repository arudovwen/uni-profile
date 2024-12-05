import { render, screen, fireEvent } from '@testing-library/vue'
import {it, expect, describe} from "vitest";
import BuyerSignUp from '~/components/Auth/BuyerSignUp.vue';
import index from '~/components/InputGroup/index.vue';

describe("BuyerSignup", () => {
	it("renders", () => {
		const component = render(index, {
			props: {
				name: "test",
				class: "bg-blue",
				disabled: false,
				type: 'string'
			}
		});
		expect(screen).toMatchSnapshot();
	})
})