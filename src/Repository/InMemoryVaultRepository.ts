import type { VaultRepository } from "../VaultRepository"
import type { Owner } from "../Vault/Owner"
import { Vault } from "../Vault"
import { VaultId } from "../Vault/VaultId"
import type { Revision } from "../Vault/Revision"
import { VaultNotFoundError } from "./Error/VaultNotFoundError"

export class InMemoryVaultRepository implements VaultRepository {
	public constructor(private vaults: Vault[]) {}

	public async create(owner: Owner, revision: Revision): Promise<Vault> {
		const idNumber = this.vaults.length + 1

		const vault = new Vault(new VaultId(`V-${idNumber}`), owner, [revision])

		this.vaults = [...this.vaults, vault]

		return await Promise.resolve(vault)
	}

	public async getById(id: VaultId): Promise<Vault> {
		const vault: Vault | undefined = this.vaults.find((vault) => vault.id.equal(id))

		return vault instanceof Vault ? await Promise.resolve(vault) : await Promise.reject(new VaultNotFoundError())
	}

	public async update(vault: Vault): Promise<void> {
		this.vaults = this.vaults.map((v) => (v.id.equal(vault.id) ? vault : v))

		await Promise.resolve()
	}

	public async findByOwner(owner: Owner): Promise<VaultId[]> {
		const vaults = this.vaults.filter((vault) => vault.owner.equal(owner))

		return await Promise.resolve(vaults.map((vault) => vault.id))
	}
}
