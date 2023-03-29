import type { webcrypto } from "node:crypto"

export class CryptoKey {
	constructor(public readonly value: webcrypto.JsonWebKey) {}
}
