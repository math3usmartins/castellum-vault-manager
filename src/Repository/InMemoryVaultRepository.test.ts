import assert from "assert"
import "mocha"
import { Key } from "../Vault/Key"
import { KeyId } from "../Vault/Key/KeyId"
import { KeyValue } from "../Vault/Key/KeyValue"
import { ClockTimestamp } from "../ClockTimestamp"
import { InMemoryVaultRepository } from "./InMemoryVaultRepository"
import { Revision } from "../Vault/Revision"
import { Status } from "../Vault/Revision/Status"
import { Owner } from "../Vault/Owner"
import { VaultUri } from "../Vault/VaultUri"
import { Vault } from "../Vault"
import { VaultId } from "../Vault/VaultId"

describe("InMemoryVaultRepository", (): void => {
	const timestamp = new ClockTimestamp(123)
	const owner = new Owner("someone")
	const vaultKey = new Key(new KeyId("K-1"), new KeyValue("first"), timestamp)

	it("must store a new vault", async () => {
		const repository = new InMemoryVaultRepository([])
		const revision = new Revision(vaultKey, owner, timestamp, new VaultUri("https://foo/bar/vault"), Status.ACTIVE)

		const createdVault = await repository.create(owner, revision)

		assert.deepStrictEqual(repository, new InMemoryVaultRepository([createdVault]))
	})

	it("must update a vault", async () => {
		const uri = new VaultUri("https://foo/bar/vault")
		const revision = new Revision(vaultKey, owner, timestamp, uri, Status.ACTIVE)
		const repository = new InMemoryVaultRepository([])

		await repository.create(owner, revision)

		const vault = new Vault(new VaultId("V-1"), owner, [revision])
		const anotherRevision = new Revision(vaultKey, owner, timestamp, uri, Status.ACTIVE)
		const updatedVault = vault.update(anotherRevision)

		await repository.update(updatedVault)

		assert.deepStrictEqual(repository, new InMemoryVaultRepository([updatedVault]))
	})

	it("must get by ID", async () => {
		const uri = new VaultUri("https://foo/bar/vault")
		const revision = new Revision(vaultKey, owner, timestamp, uri, Status.ACTIVE)
		const repository = new InMemoryVaultRepository([])

		const vault = await repository.create(owner, revision)
		const actual = await repository.getById(new VaultId("V-1"))

		assert.deepStrictEqual(actual, vault)
	})

	it("must find by owner", async () => {
		const repository = new InMemoryVaultRepository([])

		const ownerVault = await repository.create(
			owner,
			new Revision(vaultKey, owner, timestamp, new VaultUri("https://foo/bar/vault"), Status.ACTIVE),
		)

		const anotherOwner = new Owner("someone-else")
		const anotherOwnerVault = await repository.create(
			anotherOwner,
			new Revision(vaultKey, owner, timestamp, new VaultUri("https://foo/bar/another-vault"), Status.ACTIVE),
		)

		const ownerVaults = await repository.findByOwner(owner)
		assert.deepStrictEqual(ownerVaults, [ownerVault.id])

		const anotherOwnerVaults = await repository.findByOwner(anotherOwner)
		assert.deepStrictEqual(anotherOwnerVaults, [anotherOwnerVault.id])
	})
})