import osc from 'osc'
import type { OscMessage } from 'osc'
import type { OSCMetaArgument } from '@companion-module/base'
import type ShowtecLampyInstance from './main.js'
import type { SharedUdpSocket } from '@companion-module/base'
import type { ProgrammerLedName } from './oscMap.js'

export class OSCConnection {
	private instance: ShowtecLampyInstance
	private socket: SharedUdpSocket | undefined
	private ledState = new Map<string, boolean>()

	constructor(instance: ShowtecLampyInstance) {
		this.instance = instance
	}

	init(): void {
		this.destroy()

		const { incoming_port, host, outgoing_port } = this.instance.config
		if (!incoming_port || !host || !outgoing_port) {
			this.instance.updateStatus('bad_config' as any, 'Missing host, listen port, or send port')
			return
		}

		this.socket = this.instance.createSharedUdpSocket('udp4', (message) => {
			this.handleBuffer(message)
		})

		this.socket.on('error', (err) => {
			this.instance.log('error', `OSC socket error: ${err.message}`)
			this.instance.updateStatus('connection_failure' as any, err.message)
		})

		this.socket.on('listening', () => {
			this.instance.log('debug', `OSC listening on ${incoming_port}`)
			this.instance.updateStatus('ok' as any)
		})

		this.socket.bind(incoming_port)
	}

	private handleBuffer(buffer: Buffer): void {
		let message: OscMessage
		try {
			message = osc.readMessage(buffer, { metadata: true })
		} catch (err) {
			this.instance.log('warn', `Failed to parse incoming OSC: ${(err as Error).message}`)
			return
		}

		this.instance.log('debug', `RX OSC: ${message.address} ${JSON.stringify(message.args.map((a) => a.value))}`)

		const value = message.args[0]?.value
		let m: RegExpMatchArray | null

		if ((m = message.address.match(/^\/lampy\/mff\/(\d+)\/name$/))) {
			this.instance.setVariableValues({ [`mff_${m[1]}_name`]: String(value ?? '') })
		} else if ((m = message.address.match(/^\/lampy\/mff\/(\d+)\/value$/))) {
			this.instance.setVariableValues({ [`mff_${m[1]}_value`]: Number(value ?? 0) })
		} else if ((m = message.address.match(/^\/lampy\/pbf\/(\d+)\/name$/))) {
			this.instance.setVariableValues({ [`pbf_${m[1]}_name`]: String(value ?? '') })
		} else if ((m = message.address.match(/^\/lampy\/pbf\/(\d+)\/value$/))) {
			this.instance.setVariableValues({ [`pbf_${m[1]}_value`]: Number(value ?? 0) })
		} else if ((m = message.address.match(/^\/lampy\/virtual_executor\/(\d+)\/name$/))) {
			this.instance.setVariableValues({ [`virtual_executor_${m[1]}_name`]: String(value ?? '') })
		} else if (message.address === '/lampy/master/name') {
			this.instance.setVariableValues({ master_name: String(value ?? '') })
		} else if (message.address === '/lampy/master/value') {
			this.instance.setVariableValues({ master_value: Number(value ?? 0) })
		} else if ((m = message.address.match(/^\/lampy\/programmer\/encoder\/(\d+)\/text1$/))) {
			this.instance.setVariableValues({ [`encoder_${m[1]}_text1`]: String(value ?? '') })
		} else if ((m = message.address.match(/^\/lampy\/programmer\/encoder\/(\d+)\/text2$/))) {
			this.instance.setVariableValues({ [`encoder_${m[1]}_text2`]: String(value ?? '') })
		} else if ((m = message.address.match(/^\/lampy\/programmer\/(blind|highlight|clear|fan)\/led$/))) {
			const isOn = Number(value ?? 0) > 0.5
			this.ledState.set(m[1], isOn)
			this.instance.checkFeedbacks('programmer_led')
		}
	}

	getLedState(name: ProgrammerLedName): boolean {
		return this.ledState.get(name) ?? false
	}

	send(address: string, args: OSCMetaArgument[] = []): void {
		const { host, outgoing_port } = this.instance.config
		if (!host || !outgoing_port) {
			this.instance.log('warn', 'Cannot send OSC message: host/outgoing_port not configured')
			return
		}
		this.instance.oscSend(host, outgoing_port, address, args)
	}

	destroy(): void {
		if (this.socket) {
			try {
				this.socket.close()
			} catch {
				// ignore
			}
			this.socket = undefined
		}
	}
}
