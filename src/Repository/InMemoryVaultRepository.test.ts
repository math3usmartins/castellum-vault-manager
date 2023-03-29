import assert from "assert"
import "mocha"
import { ClockTimestamp } from "../ClockTimestamp"
import { InMemoryVaultRepository } from "./InMemoryVaultRepository"
import { Revision } from "../Vault/Revision"
import { Status } from "../Vault/Revision/Status"
import { Owner } from "../Vault/Owner"
import { VaultUri } from "../Vault/VaultUri"
import { Vault } from "../Vault"
import { VaultId } from "../Vault/VaultId"
import { VaultName } from "../Vault/VaultName"
import { CryptoKeyGenerator } from "../Vault/KeyGenerator/CryptoKeyGenerator"

describe("InMemoryVaultRepository", (): void => {
	const timestamp = new ClockTimestamp(123)
	const owner = new Owner("someone")
	const cryptoKeyGenerator = new CryptoKeyGenerator()

	it("must store a new vault", async (): Promise<void> => {
		const vaultKey = await cryptoKeyGenerator.generate(timestamp)
		const repository = new InMemoryVaultRepository([])
		const revision = new Revision(
			new VaultName("my-vault"),
			vaultKey,
			owner,
			timestamp,
			new VaultUri("https://foo/bar/vault"),
			Status.ACTIVE,
		)

		const createdVault = await repository.create(owner, revision)

		assert.deepStrictEqual(repository, new InMemoryVaultRepository([createdVault]))
	})

	it("must update a vault", async (): Promise<void> => {
		const vaultKey = await cryptoKeyGenerator.generate(timestamp)
		const uri = new VaultUri("https://foo/bar/vault")
		const revision = new Revision(new VaultName("my-vault"), vaultKey, owner, timestamp, uri, Status.ACTIVE)
		const repository = new InMemoryVaultRepository([])

		await repository.create(owner, revision)

		const vault = new Vault(new VaultId("V-1"), owner, [revision])
		const anotherRevision = new Revision(
			new VaultName("a-new-name"),
			vaultKey,
			owner,
			timestamp,
			uri,
			Status.ACTIVE,
		)
		const updatedVault = vault.update(anotherRevision)

		await repository.update(updatedVault)

		assert.deepStrictEqual(repository, new InMemoryVaultRepository([updatedVault]))
	})

	it("must get by ID", async (): Promise<void> => {
		const vaultKey = await cryptoKeyGenerator.generate(timestamp)
		const repository = new InMemoryVaultRepository([])

		const revision = new Revision(
			new VaultName("my-vault"),
			vaultKey,
			owner,
			timestamp,
			new VaultUri("https://foo/bar/vault"),
			Status.ACTIVE,
		)

		const vault = await repository.create(owner, revision)
		assert.deepStrictEqual(await repository.getById(vault.id), vault)

		const anotherRevision = new Revision(
			new VaultName("my-vault"),
			vaultKey,
			owner,
			timestamp,
			new VaultUri("https://foo/bar/another-vault"),
			Status.ACTIVE,
		)

		const anotherVault = await repository.create(new Owner("someone-else"), anotherRevision)
		assert.deepStrictEqual(await repository.getById(anotherVault.id), anotherVault)
	})

	it("must find by owner", async (): Promise<void> => {
		const vaultKey = await cryptoKeyGenerator.generate(timestamp)
		const repository = new InMemoryVaultRepository([])

		const ownerVault = await repository.create(
			owner,
			new Revision(
				new VaultName("my-vault"),
				vaultKey,
				owner,
				timestamp,
				new VaultUri("https://foo/bar/vault"),
				Status.ACTIVE,
			),
		)

		const anotherOwner = new Owner("someone-else")
		const anotherOwnerVault = await repository.create(
			anotherOwner,
			new Revision(
				new VaultName("my-vault"),
				vaultKey,
				owner,
				timestamp,
				new VaultUri("https://foo/bar/another-vault"),
				Status.ACTIVE,
			),
		)

		const ownerVaults = await repository.findByOwner(owner)
		assert.deepStrictEqual(ownerVaults, [ownerVault.id])

		const anotherOwnerVaults = await repository.findByOwner(anotherOwner)
		assert.deepStrictEqual(anotherOwnerVaults, [anotherOwnerVault.id])
	})
})
