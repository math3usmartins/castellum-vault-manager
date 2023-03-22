import type { ClockTimestamp } from "./ClockTimestamp"

export interface Clock {
	timestamp: () => Promise<ClockTimestamp>
}
