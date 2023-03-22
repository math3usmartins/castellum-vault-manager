import assert from "assert"
import "mocha"
import { Key } from "./Vault/Key"
import { KeyId } from "./Vault/Key/KeyId"
import { KeyValue } from "./Vault/Key/KeyValue"
import { ClockTimestamp } from "./ClockTimestamp"
import { InMemoryKeyGenerator } from "./Vault/KeyGenerator/InMemoryGenerator"
import { InMemoryClock } from "./Clock/InMemoryClock"
import { InMemoryVaultRepository } from "./Repository/InMemoryVaultRepository"
import { VaultManager } from "./VaultManager"
import { VaultUri } from "./Vault/VaultUri"
import { Owner } from "./Vault/Owner"
import { Status } from "./Vault/Revision/Status"
import { Author } from "./Vault/Revision/Author"
import { VaultName } from "./Vault/VaultName"

describe("VaultManager", (): void => {
	const key = new Key(new KeyId("K-1"), new KeyValue("foobar"), new ClockTimestamp(123))
	const person = new Owner("someone")
	const anotherPerson = new Author("someone-else")
	const uri = new VaultUri("https://foo/bar/vault")
	const anotherUri = new VaultUri("https://foo/bar/vault-updated")

	it("must create a vault", async () => {
		const keyGenerator = new InMemoryKeyGenerator([key])
		const clock = new InMemoryClock(new ClockTimestamp(123))
		const repository = new InMemoryVaultRepository([])
		const manager = new VaultManager(keyGenerator, repository, clock)

		const vault = await manager.create(person, uri, new VaultName("my-vault"))

		assert.deepStrictEqual(vault.owner, person)
		assert.deepStrictEqual(vault.current()?.key, key)
		assert.deepStrictEqual(vault.current()?.name.value, "my-vault")
		assert.deepStrictEqual(vault.current()?.author, new Author(person.value))
		assert.deepStrictEqual(vault.current()?.uri, uri)
		assert.deepStrictEqual(vault.current()?.status, Status.ACTIVE)
		assert.deepStrictEqual(vault.current()?.timestamp, await clock.timestamp())
	})

	it("must update a vault", async () => {
		const keyGenerator = new InMemoryKeyGenerator([key])
		const clock = new InMemoryClock(new ClockTimestamp(123))
		const repository = new InMemoryVaultRepository([])
		const manager = new VaultManager(keyGenerator, repository, clock)

		const vault = await manager.create(person, uri, new VaultName("my-vault"))
		const updatedVault = await manager.update(vault.id, anotherUri, anotherPerson, new VaultName("a-new-name"))

		assert.deepStrictEqual(updatedVault.owner, person)
		assert.deepStrictEqual(updatedVault.current()?.key, key)
		assert.deepStrictEqual(updatedVault.current()?.name.value, "a-new-name")
		assert.deepStrictEqual(updatedVault.current()?.author, anotherPerson)
		assert.deepStrictEqual(updatedVault.current()?.uri, anotherUri)
		assert.deepStrictEqual(updatedVault.current()?.status, Status.ACTIVE)
		assert.deepStrictEqual(updatedVault.current()?.timestamp, await clock.timestamp())
	})

	it("must find by owner", async () => {
		const keyGenerator = new InMemoryKeyGenerator([key])
		const clock = new InMemoryClock(new ClockTimestamp(123))
		const repository = new InMemoryVaultRepository([])
		const manager = new VaultManager(keyGenerator, repository, clock)
		const vault = await manager.create(person, uri, new VaultName("my-vault"))

		let vaults = await manager.findByOwner(person)
		assert.deepStrictEqual(vaults, [vault.id])

		vaults = await manager.findByOwner(new Owner("someone-else"))
		assert.deepStrictEqual([], vaults)
	})
})
