declare module 'osc' {
	export interface OscMetaArgument {
		type: 'i' | 'f' | 's' | 'b' | 'T' | 'F' | 'N' | 'I'
		value: number | string | Uint8Array | undefined
	}

	export interface OscMessage {
		address: string
		args: OscMetaArgument[]
	}

	interface OscModule {
		readMessage(data: Buffer | Uint8Array, options?: { metadata?: boolean }): OscMessage
	}

	const osc: OscModule
	export default osc
}
