import type { KeyGenerator } from "./Vault/KeyGenerator"
import type { VaultRepository } from "./VaultRepository"
import type { Clock } from "./Clock"
import type { Owner } from "./Vault/Owner"
import type { VaultUri } from "./Vault/VaultUri"
import type { Vault } from "./Vault"
import { Revision } from "./Vault/Revision"
import { Status } from "./Vault/Revision/Status"
import type { VaultId } from "./Vault/VaultId"
import { Author } from "./Vault/Revision/Author"
import { CurrentRevisionNotFoundError } from "./Error/CurrentRevisionNotFoundError"
import type { VaultName } from "./Vault/VaultName"

export class VaultManager {
	constructor(
		private readonly keyGenerator: KeyGenerator,
		private readonly repository: VaultRepository,
		private readonly clock: Clock,
	) {}

	public async create(owner: Owner, uri: VaultUri, name: VaultName): Promise<Vault> {
		const timestamp = await this.clock.timestamp()
		const key = await this.keyGenerator.generate(timestamp)
		const revision = new Revision(name, key, new Author(owner.value), timestamp, uri, Status.ACTIVE)

		return await this.repository.create(owner, revision)
	}

	public async update(id: VaultId, uri: VaultUri, author: Author, name: VaultName): Promise<Vault> {
		const vault = await this.repository.getById(id)
		const currentRevision = vault.current()

		if (currentRevision == null) {
			return await Promise.reject(new CurrentRevisionNotFoundError())
		}

		const timestamp = await this.clock.timestamp()
		const updatedVault = vault.update(
			new Revision(name, currentRevision.key, author, timestamp, uri, Status.ACTIVE),
		)

		await this.repository.update(updatedVault)

		return updatedVault
	}

	public async findByOwner(owner: Owner): Promise<VaultId[]> {
		return await this.repository.findByOwner(owner)
	}
}
