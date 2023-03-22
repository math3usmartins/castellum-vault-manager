export class VaultId {
	constructor(public readonly value: string) {}

	public equal = (another: VaultId): boolean => this.value === another.value
}
