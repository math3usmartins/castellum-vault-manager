import { Status } from "./Revision/Status"
import type { Key } from "./Key"
import type { Author } from "./Revision/Author"
import type { ClockTimestamp } from "../ClockTimestamp"
import type { VaultUri } from "./VaultUri"
import type { VaultName } from "./VaultName"

export class Revision {
	constructor(
		public readonly name: VaultName,
		public readonly key: Key,
		public readonly author: Author,
		public readonly timestamp: ClockTimestamp,
		public readonly uri: VaultUri,
		public readonly status: Status,
	) {}

	public active(): Revision {
		return new Revision(this.name, this.key, this.author, this.timestamp, this.uri, Status.ACTIVE)
	}

	public inactive(): Revision {
		return new Revision(this.name, this.key, this.author, this.timestamp, this.uri, Status.INACTIVE)
	}
}
