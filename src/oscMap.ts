import type { ShowtecLampyConfig } from './config.js'

export function getMffCount(model: ShowtecLampyConfig['model']): number {
	return model === 'lampy20' ? 10 : 30
}

export const PBF_COUNT = 10
export const VE_COUNT = 40
export const ENCODER_COUNT = 4

export const PROGRAMMER_BUTTONS = [
	{ id: 'blind_btn', label: 'Blind', address: '/lampy/programmer/blind/btn' },
	{ id: 'highlight_btn', label: 'Highlight', address: '/lampy/programmer/highlight/btn' },
	{ id: 'clear_btn', label: 'Clear', address: '/lampy/programmer/clear/btn' },
	{ id: 'fan_btn', label: 'Fan', address: '/lampy/programmer/fan/btn' },
	{ id: 'home', label: 'Home', address: '/lampy/programmer/home' },
	{ id: 'copy', label: 'Copy', address: '/lampy/programmer/copy' },
	{ id: 'delete', label: 'Delete', address: '/lampy/programmer/delete' },
	{ id: 'edit', label: 'Edit', address: '/lampy/programmer/edit' },
	{ id: 'record', label: 'Record', address: '/lampy/programmer/record' },
	{ id: 'intensity', label: 'Intensity', address: '/lampy/programmer/intensity' },
	{ id: 'color', label: 'Color', address: '/lampy/programmer/color' },
	{ id: 'gobo', label: 'Gobo', address: '/lampy/programmer/gobo' },
	{ id: 'position', label: 'Position', address: '/lampy/programmer/position' },
	{ id: 'beam', label: 'Beam', address: '/lampy/programmer/beam' },
	{ id: 'magic', label: 'Magic', address: '/lampy/programmer/magic' },
	{ id: 'off', label: 'Off', address: '/lampy/programmer/off' },
	{ id: 'special', label: 'Special', address: '/lampy/programmer/special' },
	{ id: 'select_next', label: 'Select Next', address: '/lampy/programmer/select/next' },
	{ id: 'select_previous', label: 'Select Previous', address: '/lampy/programmer/select/previous' },
	{ id: 'fader_mode', label: 'Fader Mode', address: '/lampy/programmer/fader_mode' },
] as const

export const PROGRAMMER_LEDS = ['blind', 'highlight', 'clear', 'fan'] as const
export type ProgrammerLedName = (typeof PROGRAMMER_LEDS)[number]

export const Address = {
	masterValue: '/lampy/master/value',
	masterGo: '/lampy/master/go',
	masterPauseBack: '/lampy/master/pause_back',
	pbfPageNext: '/lampy/pbf/page/next',
	pbfPagePrevious: '/lampy/pbf/page/previous',
	programmerShift: '/lampy/programmer/shift',
	programmerPanTilt: '/lampy/programmer/pan_tilt',

	mffValue: (n: number): string => `/lampy/mff/${n}/value`,
	mffFlash: (n: number): string => `/lampy/mff/${n}/flash`,
	pbfValue: (n: number): string => `/lampy/pbf/${n}/value`,
	pbfFlash: (n: number): string => `/lampy/pbf/${n}/flash`,
	veFlash: (n: number): string => `/lampy/virtual_executor/${n}/flash`,
	encoderBtn: (n: number): string => `/lampy/programmer/encoder/${n}/btn`,
	encoderInc: (n: number): string => `/lampy/programmer/encoder/${n}/inc`,
	programmerLed: (name: ProgrammerLedName): string => `/lampy/programmer/${name}/led`,
}

/** Generates '1'..'N' choices for dropdown options */
export function rangeChoices(count: number): { id: string; label: string }[] {
	return Array.from({ length: count }, (_, i) => ({ id: String(i + 1), label: String(i + 1) }))
}
