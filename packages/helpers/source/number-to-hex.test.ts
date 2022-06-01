import { describe } from "@ardenthq/sdk-test";

import { numberToHex } from "./number-to-hex";

describe("numberToHex", async ({ assert, it, nock, loader }) => {
	it("should return the number as hex", () => {
		assert.is(numberToHex(1), "01");
	});
});
