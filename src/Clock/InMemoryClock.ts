import type { Clock } from "../Clock"
import type { ClockTimestamp } from "../ClockTimestamp"

export class InMemoryClock implements Clock {
	constructor(private readonly value: ClockTimestamp) {}

	public timestamp = async (): Promise<ClockTimestamp> => await Promise.resolve(this.value)
}
