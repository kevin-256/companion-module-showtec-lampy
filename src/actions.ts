import type ShowtecLampyInstance from './main.js'
import { Address, PROGRAMMER_BUTTONS, getMffCount, PBF_COUNT, VE_COUNT, ENCODER_COUNT, rangeChoices } from './oscMap.js'

export type ActionsSchema = {
	master_value: { options: { value: number } }
	master_go: { options: Record<string, never> }
	master_pause_back: { options: Record<string, never> }
	mff_value: { options: { fader: string; value: number } }
	mff_flash: { options: { fader: string } }
	pbf_value: { options: { fader: string; value: number } }
	pbf_flash: { options: { fader: string } }
	pbf_page_next: { options: Record<string, never> }
	pbf_page_previous: { options: Record<string, never> }
	virtual_executor_flash: { options: { executor: string } }
	programmer_button: { options: { button: string } }
	programmer_shift: { options: Record<string, never> }
	programmer_pan_tilt: { options: { pan: number; tilt: number } }
	encoder_inc: { options: { encoder: string; delta: number } }
	encoder_btn: { options: { encoder: string } }
	raw_osc: { options: { address: string; args: string } }
}

function parseArgs(argsStr: string): number[] {
	return argsStr
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
		.map(Number)
		.filter((n) => !Number.isNaN(n))
}

export function UpdateActions(self: ShowtecLampyInstance): void {
	const mffCount = getMffCount(self.config.model)

	self.setActionDefinitions({
		master_value: {
			name: 'Master: Set Value',
			options: [{ id: 'value', type: 'number', label: 'Value (0-1000)', default: 1000, min: 0, max: 1000 }],
			callback: async (event) => {
				self.osc.send(Address.masterValue, [{ type: 'f', value: event.options.value }])
			},
		},
		master_go: {
			name: 'Master: Go',
			options: [],
			callback: async () => {
				self.osc.send(Address.masterGo, [{ type: 'f', value: 1 }])
			},
		},
		master_pause_back: {
			name: 'Master: Pause/Back',
			options: [],
			callback: async () => {
				self.osc.send(Address.masterPauseBack, [{ type: 'f', value: 1 }])
			},
		},
		mff_value: {
			name: 'MFF: Set Value',
			options: [
				{ id: 'fader', type: 'dropdown', label: 'Fader', default: '1', choices: rangeChoices(mffCount) },
				{ id: 'value', type: 'number', label: 'Value (0-1000)', default: 1000, min: 0, max: 1000 },
			],
			callback: async (event) => {
				self.osc.send(Address.mffValue(Number(event.options.fader)), [{ type: 'f', value: event.options.value }])
			},
		},
		mff_flash: {
			name: 'MFF: Flash',
			options: [{ id: 'fader', type: 'dropdown', label: 'Fader', default: '1', choices: rangeChoices(mffCount) }],
			callback: async (event) => {
				self.osc.send(Address.mffFlash(Number(event.options.fader)), [{ type: 'f', value: 1 }])
			},
		},
		pbf_value: {
			name: 'PBF: Set Value',
			options: [
				{ id: 'fader', type: 'dropdown', label: 'Fader', default: '1', choices: rangeChoices(PBF_COUNT) },
				{ id: 'value', type: 'number', label: 'Value (0-1000)', default: 1000, min: 0, max: 1000 },
			],
			callback: async (event) => {
				self.osc.send(Address.pbfValue(Number(event.options.fader)), [{ type: 'f', value: event.options.value }])
			},
		},
		pbf_flash: {
			name: 'PBF: Flash',
			options: [{ id: 'fader', type: 'dropdown', label: 'Fader', default: '1', choices: rangeChoices(PBF_COUNT) }],
			callback: async (event) => {
				self.osc.send(Address.pbfFlash(Number(event.options.fader)), [{ type: 'f', value: 1 }])
			},
		},
		pbf_page_next: {
			name: 'PBF: Page Next',
			options: [],
			callback: async () => {
				self.osc.send(Address.pbfPageNext, [{ type: 'f', value: 1 }])
			},
		},
		pbf_page_previous: {
			name: 'PBF: Page Previous',
			options: [],
			callback: async () => {
				self.osc.send(Address.pbfPagePrevious, [{ type: 'f', value: 1 }])
			},
		},
		virtual_executor_flash: {
			name: 'Virtual Executor: Flash',
			options: [{ id: 'executor', type: 'dropdown', label: 'Executor', default: '1', choices: rangeChoices(VE_COUNT) }],
			callback: async (event) => {
				self.osc.send(Address.veFlash(Number(event.options.executor)), [{ type: 'f', value: 1 }])
			},
		},
		programmer_button: {
			name: 'Programmer: Button',
			options: [
				{
					id: 'button',
					type: 'dropdown',
					label: 'Button',
					default: PROGRAMMER_BUTTONS[0].id,
					choices: PROGRAMMER_BUTTONS.map((b) => ({ id: b.id, label: b.label })),
				},
			],
			callback: async (event) => {
				const btn = PROGRAMMER_BUTTONS.find((b) => b.id === event.options.button)
				if (btn) self.osc.send(btn.address, [{ type: 'f', value: 1 }])
			},
		},
		programmer_shift: {
			name: 'Programmer: Shift Toggle',
			options: [],
			callback: async () => {
				self.osc.send(Address.programmerShift, [{ type: 'f', value: 1 }])
			},
		},
		programmer_pan_tilt: {
			name: 'Programmer: Pan/Tilt',
			options: [
				{ id: 'pan', type: 'number', label: 'Pan (0-1)', default: 0.5, min: 0, max: 1, step: 0.01 },
				{ id: 'tilt', type: 'number', label: 'Tilt (0-1)', default: 0.5, min: 0, max: 1, step: 0.01 },
			],
			callback: async (event) => {
				self.osc.send(Address.programmerPanTilt, [
					{ type: 'f', value: event.options.pan },
					{ type: 'f', value: event.options.tilt },
				])
			},
		},
		encoder_inc: {
			name: 'Programmer Encoder: Increment',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', default: '1', choices: rangeChoices(ENCODER_COUNT) },
				{ id: 'delta', type: 'number', label: 'Delta (-2 to 2)', default: 1, min: -2, max: 2, step: 0.01 },
			],
			callback: async (event) => {
				self.osc.send(Address.encoderInc(Number(event.options.encoder)), [{ type: 'f', value: event.options.delta }])
			},
		},
		encoder_btn: {
			name: 'Programmer Encoder: Button',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', default: '1', choices: rangeChoices(ENCODER_COUNT) },
			],
			callback: async (event) => {
				self.osc.send(Address.encoderBtn(Number(event.options.encoder)), [{ type: 'f', value: 1 }])
			},
		},
		raw_osc: {
			name: 'Send Raw OSC Message',
			options: [
				{ id: 'address', type: 'textinput', label: 'OSC Address', default: '/lampy/' },
				{ id: 'args', type: 'textinput', label: 'Float Args (comma separated, optional)', default: '' },
			],
			callback: async (event) => {
				const args = parseArgs(event.options.args).map((value) => ({ type: 'f' as const, value }))
				self.osc.send(event.options.address, args)
			},
		},
	})
}
