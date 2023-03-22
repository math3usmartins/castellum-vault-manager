import type { ClockTimestamp } from "../ClockTimestamp"
import type { KeyId } from "./Key/KeyId"
import type { KeyValue } from "./Key/KeyValue"

export class Key {
	constructor(readonly id: KeyId, readonly value: KeyValue, readonly timestamp: ClockTimestamp) {}
}
