import { App } from './app'

export default async function main(): Promise<void> {
	try {
		const app = new App({
			port: 3001,
			authTokenSecret: 'a498a5cf13a8194a2477f9284df34af3954fad3dc8459e343a',
			authTokenExpiryDuration: '2h',
			database: {
				host: 'localhost',
				database: 'kysely_koa_example_test',
				user: 'postgres',
				password: 'postgres',
			},
		})

		await app.start()
		console.log('Starting app...', 'http://localhost:3001')
	} catch (error) {
		console.error({ error })
	}
}

main()