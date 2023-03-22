export class Owner {
	constructor(public readonly value: string) {}

	public equal = (another: Owner): boolean => this.value === another.value
}
