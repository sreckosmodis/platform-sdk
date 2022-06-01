import { describe } from "@ardenthq/sdk-test";

import { ordinal } from "./ordinal";

describe("ordinal", async ({ assert, it, nock, loader }) => {
	it("should return the number with the correct suffix", () => {
		assert.is(ordinal(1), "1st");
		assert.is(ordinal(2), "2nd");
		assert.is(ordinal(3), "3rd");
		assert.is(ordinal(4), "4th");
		assert.is(ordinal(10), "10th");
		assert.is(ordinal(100), "100th");
		assert.is(ordinal(1000), "1000th");
		assert.is(ordinal(10000), "10000th");
		assert.is(ordinal(100000), "100000th");
		assert.is(ordinal(1000000), "1000000th");
		assert.is(ordinal(10000000), "10000000th");
	});
});
