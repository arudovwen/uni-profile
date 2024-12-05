import { render } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import index from "~/components/Dropdown/index.vue"

describe('index', () => {
	it("Should render without error", () => {
		const component = render(index);
		expect(screen).toMatchSnapshot();
	})
})