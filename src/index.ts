import App from './app'
import { config } from './config'
export default async function main(): Promise<void> {
	try {
		const app = new App(config)

		await app.start()
		console.log('Starting app...', 'http://localhost:3001')
	} catch (error) {
		console.error({ error })
	}
}

main()