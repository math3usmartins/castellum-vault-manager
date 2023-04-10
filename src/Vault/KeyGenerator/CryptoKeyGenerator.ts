import type { KeyGenerator } from "../KeyGenerator"
import { webcrypto } from "node:crypto"
import { Key } from "../Key"
import type { ClockTimestamp } from "../../ClockTimestamp"
import { KeyId } from "../Key/KeyId"
import { CryptoKey } from "../Key/CryptoKey"
import { KeyAlgorithm } from "../Key/KeyAlgorithm"

export class CryptoKeyGenerator implements KeyGenerator {
	static readonly FORMAT = "jwk"

	static readonly ALGORITHM = {
		name: "AES-GCM",
		length: 256,
	}

	public async generate(timestamp: ClockTimestamp): Promise<Key> {
		const cryptoKey = await webcrypto.subtle.generateKey(CryptoKeyGenerator.ALGORITHM, true, ["encrypt", "decrypt"])

		const exported: webcrypto.JsonWebKey = await webcrypto.subtle.exportKey(CryptoKeyGenerator.FORMAT, cryptoKey)

		return await Promise.resolve(
			new Key(
				new KeyId(webcrypto.randomUUID()),
				new CryptoKey(exported),
				timestamp,
				new KeyAlgorithm(
					CryptoKeyGenerator.ALGORITHM.name,
					CryptoKeyGenerator.ALGORITHM.length,
					webcrypto.getRandomValues(new Uint8Array(12)),
				),
			),
		)
	}

	public static async toNativeCryptoKey(vaultKey: Key): Promise<webcrypto.CryptoKey> {
		return await webcrypto.subtle.importKey(
			CryptoKeyGenerator.FORMAT,
			vaultKey.cryptoKey.value,
			vaultKey.algorithm,
			true,
			["encrypt", "decrypt"],
		)
	}
}
