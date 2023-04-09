import type { KeyGenerator } from "../KeyGenerator"
import { webcrypto } from "node:crypto"
import { Key } from "../Key"
import type { ClockTimestamp } from "../../ClockTimestamp"
import { KeyId } from "../Key/KeyId"
import { CryptoKey } from "../Key/CryptoKey"

export class CryptoKeyGenerator implements KeyGenerator {
	public async generate(timestamp: ClockTimestamp): Promise<Key> {
		const cryptoKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
			"encrypt",
			"decrypt",
		])

		const exported: webcrypto.JsonWebKey = await webcrypto.subtle.exportKey("jwk", cryptoKey)

		return await Promise.resolve(Key.create(new KeyId(webcrypto.randomUUID()), new CryptoKey(exported), timestamp))
	}

	public static async toNativeCryptoKey(vaultKey: Key): Promise<webcrypto.CryptoKey> {
		return await webcrypto.subtle.importKey("jwk", vaultKey.cryptoKey.value, vaultKey.algorithm, true, [
			"encrypt",
			"decrypt",
		])
	}
}
