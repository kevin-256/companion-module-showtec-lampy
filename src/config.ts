import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type ShowtecLampyConfig = {
	host: string
	incoming_port: number
	outgoing_port: number
	model: 'lampy20' | 'lampy40'
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Information',
			value: 'To enable OSC on Lampy, enable OSC in the Menu, Show Settings, OSC.',
			width: 12,
		},
		{
			type: 'dropdown',
			id: 'model',
			label: 'Console Model',
			width: 4,
			default: 'lampy40',
			choices: [
				{ id: 'lampy20', label: 'Lampy 20 (10 MFF)' },
				{ id: 'lampy40', label: 'Lampy 40 (30 MFF)' },
			],
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			tooltip: 'The IP of the Lampy console',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'outgoing_port',
			label: 'OSC Port (outgoing)',
			width: 4,
			min: 1,
			max: 65535,
			default: 8000,
		},
		{
			type: 'number',
			id: 'incoming_port',
			label: 'OSC Port (incoming)',
			width: 4,
			min: 1,
			max: 65535,
			default: 9000,
		},
	]
}
