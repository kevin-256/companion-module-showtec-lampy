import type { ShowtecLampySchema } from './main.js'
import type ShowtecLampyInstance from './main.js'
import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'

export function UpdatePresets(self: ShowtecLampyInstance): void {
	const structure: CompanionPresetSection[] = [
		{
			id: 'section1',
			name: 'Section One',
			definitions: [
				{
					id: 'group1',
					name: 'Group One',
					description: 'A starting point for preset definitions!',
					type: 'simple',
					presets: ['mylabel'],
				},
			],
		},
	]

	const presets: CompanionPresetDefinitions<ShowtecLampySchema> = {}
	presets['mylabel'] = {
		type: 'simple',
		name: 'Name',
		style: {
			text: 'My first Preset button',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	}

	self.setPresetDefinitions(structure, presets)
}
