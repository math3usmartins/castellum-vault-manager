import assert from "assert"
import "mocha"
import { Revision } from "./Revision"
import { Author } from "./Revision/Author"
import { ClockTimestamp } from "../ClockTimestamp"
import { VaultUri } from "./VaultUri"
import { Status } from "./Revision/Status"
import { VaultName } from "./VaultName"
import { CryptoKeyGenerator } from "./KeyGenerator/CryptoKeyGenerator"

describe("Revision", (): void => {
	const timestamp = new ClockTimestamp(123)
	const cryptoKeyGenerator = new CryptoKeyGenerator()
	const author = new Author("someone")

	it("must become active", async (): Promise<void> => {
		const key = await cryptoKeyGenerator.generate(timestamp)

		const revision = new Revision(
			new VaultName("my-vault"),
			key,
			author,
			new ClockTimestamp(123),
			new VaultUri("https://foo/bar/vault"),
			Status.INACTIVE,
		)

		assert.equal(revision.active().status, Status.ACTIVE)
	})

	it("must become inactive", async (): Promise<void> => {
		const key = await cryptoKeyGenerator.generate(timestamp)

		const revision = new Revision(
			new VaultName("my-vault"),
			key,
			author,
			new ClockTimestamp(123),
			new VaultUri("https://foo/bar/vault"),
			Status.ACTIVE,
		)

		assert.equal(revision.inactive().status, Status.INACTIVE)
	})
})
