import type { KeyAlgorithm } from "./Key/KeyAlgorithm"
import type { ClockTimestamp } from "../ClockTimestamp"
import type { KeyId } from "./Key/KeyId"
import type { CryptoKey } from "./Key/CryptoKey"

export class Key {
	constructor(
		readonly id: KeyId,
		readonly cryptoKey: CryptoKey,
		readonly timestamp: ClockTimestamp,
		readonly algorithm: KeyAlgorithm,
	) {}
}
