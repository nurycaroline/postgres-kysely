import { expect } from 'chai'

import { TestContext } from '../test-context'
import { User } from '../../src/user/user'

describe('user tests', () => {
  const ctx = new TestContext()

  before(ctx.before)
  beforeEach(ctx.beforeEach)

  after(ctx.after)
  afterEach(ctx.afterEach)

  it('should create an user', async () => {
    const res = await ctx.request.post(`/api/v1/user`, {
      firstName: 'Anon',
    })

    expect(res.status).to.equal(201)
    expect(res.data.firstName).to.equal('Anon')
    expect(res.data.lastName).to.equal(null)
    expect(res.data.email).to.equal(null)

    // The returned auth token should be usable.
    const getRes = await ctx.request.get<User>(
      `/api/v1/user/${res.data.id}`,
    )

    console.log({ getRes, res: res.data })

    expect(getRes.status).to.equal(200)
    expect(getRes.data).to.eql(res.data)
  })

  it('should get user by id', async () => {
    const user = await ctx.createUser()

    const res = await ctx.request.get<User>(
      `/api/v1/user/${user.id}`,
    )

    expect(res.status).to.equal(200)
    expect(res.data).to.eql(user)
  })
})
