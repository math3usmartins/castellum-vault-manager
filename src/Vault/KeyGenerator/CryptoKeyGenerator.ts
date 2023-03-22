import type { KeyGenerator } from "../KeyGenerator"
import { webcrypto } from "node:crypto"
import { TextDecoder } from "util"
import { Key } from "../Key"
import type { ClockTimestamp } from "../../ClockTimestamp"
import { KeyId } from "../Key/KeyId"
import { KeyValue } from "../Key/KeyValue"

export class CryptoKeyGenerator implements KeyGenerator {
	public async generate(timestamp: ClockTimestamp): Promise<Key> {
		const cryptoKey = await webcrypto.subtle.generateKey(
			{
				name: "AES-GCM",
				length: 512,
			},
			true,
			["encrypt", "decrypt"],
		)

		const rawKey = await webcrypto.subtle.exportKey("raw", cryptoKey)

		return await Promise.resolve(
			new Key(new KeyId(webcrypto.randomUUID()), new KeyValue(new TextDecoder().decode(rawKey)), timestamp),
		)
	}
}
