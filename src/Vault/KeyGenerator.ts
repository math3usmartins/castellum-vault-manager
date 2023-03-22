import type { Key } from "./Key"
import type { ClockTimestamp } from "../ClockTimestamp"

export interface KeyGenerator {
	generate: (timestamp: ClockTimestamp) => Promise<Key>
}
