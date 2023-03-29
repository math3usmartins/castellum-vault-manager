import { webcrypto } from "node:crypto"
import { KeyAlgorithm } from "./Key/KeyAlgorithm"

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

	public static create(id: KeyId, cryptoKey: CryptoKey, timestamp: ClockTimestamp): Key {
		return new Key(id, cryptoKey, timestamp, new KeyAlgorithm(webcrypto.getRandomValues(new Uint8Array(12))))
	}
}
