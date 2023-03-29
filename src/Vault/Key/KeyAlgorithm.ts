export class KeyAlgorithm {
	public readonly name = "AES-GCM"
	public readonly length = 256

	constructor(public readonly iv: Uint8Array) {}
}
