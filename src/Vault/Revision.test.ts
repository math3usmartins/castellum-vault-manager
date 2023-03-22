import assert from "assert"
import "mocha"
import { Revision } from "./Revision"
import { Key } from "./Key"
import { Author } from "./Revision/Author"
import { ClockTimestamp } from "../ClockTimestamp"
import { VaultUri } from "./VaultUri"
import { Status } from "./Revision/Status"
import { KeyId } from "./Key/KeyId"
import { KeyValue } from "./Key/KeyValue"
import { VaultName } from "./VaultName"

describe("Revision", (): void => {
	const key = new Key(new KeyId("K-1"), new KeyValue("foobar"), new ClockTimestamp(123))
	const author = new Author("someone")

	it("must become active", (): void => {
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

	it("must become inactive", (): void => {
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
