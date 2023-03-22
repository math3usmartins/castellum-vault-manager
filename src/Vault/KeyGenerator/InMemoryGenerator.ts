import type { KeyGenerator } from "../KeyGenerator"
import type { Key } from "../Key"
import type { ClockTimestamp } from "../../ClockTimestamp"
import { FailedToGenerateKeyError } from "./Error/FailedToGenerateKeyError"

export class InMemoryKeyGenerator implements KeyGenerator {
	constructor(private keys: Key[]) {}

	async generate(_timestamp: ClockTimestamp): Promise<Key> {
		const next = this.keys[0]

		if (next === undefined) {
			return await Promise.reject(new FailedToGenerateKeyError())
		}

		this.keys = this.keys.slice(1)

		return await Promise.resolve(next)
	}
}
