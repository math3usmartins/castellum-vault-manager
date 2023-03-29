import assert from "assert"
import "mocha"
import { webcrypto } from "crypto"
import { TextDecoder, TextEncoder } from "util"
import { CryptoKeyGenerator } from "./CryptoKeyGenerator"
import { ClockTimestamp } from "../../ClockTimestamp"

import type { Key } from "../Key"

describe("CryptoKeyGenerator", (): void => {
	it("must generate with given timestamp", async () => {
		const generator = new CryptoKeyGenerator()
		const timestamp = new ClockTimestamp(456)

		const key = await generator.generate(timestamp)

		assert.equal(key.timestamp, timestamp)
	})

	it("must support encrypting and decrypting a value", async () => {
		const generator = new CryptoKeyGenerator()
		const timestamp = new ClockTimestamp(456)
		const vaultKey = await generator.generate(timestamp)
		const cryptoKey = await importKey(vaultKey)
		const message = "lorem ipsum sit amet"
		const encodedMessage = new TextEncoder().encode(message)

		const encryptedBytes = await webcrypto.subtle.encrypt(vaultKey.algorithm, cryptoKey, encodedMessage)
		const decryptedBytes = await webcrypto.subtle.decrypt(vaultKey.algorithm, cryptoKey, encryptedBytes)
		const decryptedMessage = new TextDecoder().decode(decryptedBytes)

		assert.equal(decryptedMessage, message)
	})

	it("must fail to decrypt using a bad key", async () => {
		const generator = new CryptoKeyGenerator()
		const timestamp = new ClockTimestamp(456)
		const vaultKey = await generator.generate(timestamp)

		const cryptoKey = await importKey(vaultKey)
		const message = "lorem ipsum sit amet"
		const encodedMessage = new TextEncoder().encode(message)

		const encryptedBytes = await webcrypto.subtle.encrypt(vaultKey.algorithm, cryptoKey, encodedMessage)

		const anotherVaultKey = await generator.generate(timestamp)
		const anotherCryptoKey = await importKey(anotherVaultKey)

		const failed = await webcrypto.subtle
			.decrypt(anotherVaultKey.algorithm, anotherCryptoKey, encryptedBytes)
			.then(() => false)
			.catch(
				(err) =>
					err instanceof Error &&
					err.message.includes("The operation failed for an operation-specific reason"),
			)

		assert.equal(failed, true)
	})
})

async function importKey(vaultKey: Key): Promise<webcrypto.CryptoKey> {
	return await webcrypto.subtle.importKey("jwk", vaultKey.cryptoKey.value, vaultKey.algorithm, true, [
		"encrypt",
		"decrypt",
	])
}
