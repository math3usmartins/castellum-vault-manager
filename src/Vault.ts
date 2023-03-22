import type { VaultId } from "./Vault/VaultId"
import { Revision } from "./Vault/Revision"
import type { Owner } from "./Vault/Owner"
import { Status } from "./Vault/Revision/Status"

export class Vault {
	constructor(public readonly id: VaultId, public readonly owner: Owner, public readonly revisions: Revision[]) {}

	public update(revision: Revision): Vault {
		const previousRevisions = this.revisions.map((previous) => previous.inactive())

		return new Vault(this.id, this.owner, [...previousRevisions, revision.active()])
	}

	public current(): Revision | null {
		const revision: Revision | undefined = this.revisions.find((r) => r.status === Status.ACTIVE)

		return revision instanceof Revision ? revision : null
	}
}
