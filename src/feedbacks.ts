import type ShowtecLampyInstance from './main.js'
import { PROGRAMMER_LEDS, type ProgrammerLedName } from './oscMap.js'

export type FeedbacksSchema = {
	programmer_led: {
		type: 'boolean'
		options: { led: ProgrammerLedName }
	}
}

export function UpdateFeedbacks(self: ShowtecLampyInstance): void {
	self.setFeedbackDefinitions({
		programmer_led: {
			name: 'Programmer LED State',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00, color: 0x000000 },
			options: [
				{
					id: 'led',
					type: 'dropdown',
					label: 'LED',
					default: PROGRAMMER_LEDS[0],
					choices: PROGRAMMER_LEDS.map((led) => ({ id: led, label: led })),
				},
			],
			callback: (feedback) => {
				return self.osc.getLedState(feedback.options.led)
			},
		},
	})
}
