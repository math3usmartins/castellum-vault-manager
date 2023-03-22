import assert from "assert"
import "mocha"
import { Key } from "../Key"
import { InMemoryKeyGenerator } from "./InMemoryGenerator"
import { ClockTimestamp } from "../../ClockTimestamp"
import { KeyId } from "../Key/KeyId"
import { KeyValue } from "../Key/KeyValue"

describe("InMemoryKeyGenerator", (): void => {
	const firstKey = new Key(new KeyId("K-1"), new KeyValue("first"), new ClockTimestamp(123))
	const secondKey = new Key(new KeyId("K-2"), new KeyValue("second"), new ClockTimestamp(456))

	it("must generate and update remaining keys", async () => {
		const generator = new InMemoryKeyGenerator([firstKey, secondKey])

		// p.s. given clock timestamp doesn't matter in this case
		let next = await generator.generate(new ClockTimestamp(100))
		assert.deepStrictEqual(next, firstKey)

		next = await generator.generate(new ClockTimestamp(200))
		assert.deepStrictEqual(next, secondKey)
	})
})
