import { render } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import SplitDropdown from "~/components/Dropdown/SplitDropdown.vue";

describe('SplitDropdown', () => {
	it("Should render without error", () => {
		const component = render(SplitDropdown);
		expect(screen).toMatchSnapshot();
	})
})