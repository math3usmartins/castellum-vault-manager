import type { Owner } from "./Vault/Owner"
import type { Vault } from "./Vault"
import type { Revision } from "./Vault/Revision"
import type { VaultId } from "./Vault/VaultId"

export interface VaultRepository {
	create: (owner: Owner, revision: Revision) => Promise<Vault>
	getById: (id: VaultId) => Promise<Vault>
	update: (vault: Vault) => Promise<void>
	findByOwner: (owner: Owner) => Promise<VaultId[]>
}
