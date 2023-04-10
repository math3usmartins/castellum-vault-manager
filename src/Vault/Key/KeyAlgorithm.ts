export class KeyAlgorithm {
	constructor(public readonly name: string, public readonly length: number, public readonly iv: Uint8Array) {}
}
