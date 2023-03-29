import assert from "assert"
import "mocha"
import { InMemoryKeyGenerator } from "./InMemoryKeyGenerator"
import { ClockTimestamp } from "../../ClockTimestamp"
import { CryptoKeyGenerator } from "./CryptoKeyGenerator"

describe("InMemoryKeyGenerator", (): void => {
	const timestamp = new ClockTimestamp(123)
	const cryptoKeyGenerator = new CryptoKeyGenerator()

	it("must generate and update remaining keys", async (): Promise<void> => {
		const firstKey = await cryptoKeyGenerator.generate(timestamp)
		const secondKey = await cryptoKeyGenerator.generate(timestamp)

		const generator = new InMemoryKeyGenerator([firstKey, secondKey])

		// p.s. given clock timestamp doesn't matter in this case
		let next = await generator.generate(new ClockTimestamp(100))
		assert.deepStrictEqual(next, firstKey)

		next = await generator.generate(new ClockTimestamp(200))
		assert.deepStrictEqual(next, secondKey)
	})
})
