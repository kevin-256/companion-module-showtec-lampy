import type ShowtecLampyInstance from './main.js'
import { getMffCount, PBF_COUNT, VE_COUNT, ENCODER_COUNT } from './oscMap.js'

export type VariablesSchema = Record<string, string | number>

export function UpdateVariableDefinitions(self: ShowtecLampyInstance): void {
	const mffCount = getMffCount(self.config.model)

	const variables: Record<string, { name: string }> = {
		master_name: { name: 'Master Name' },
		master_value: { name: 'Master Value' },
	}

	for (let i = 1; i <= mffCount; i++) {
		variables[`mff_${i}_name`] = { name: `MFF ${i} Name` }
		variables[`mff_${i}_value`] = { name: `MFF ${i} Value` }
	}
	for (let i = 1; i <= PBF_COUNT; i++) {
		variables[`pbf_${i}_name`] = { name: `PBF ${i} Name` }
		variables[`pbf_${i}_value`] = { name: `PBF ${i} Value` }
	}
	for (let i = 1; i <= VE_COUNT; i++) variables[`virtual_executor_${i}_name`] = { name: `Virtual Executor ${i} Name` }
	for (let i = 1; i <= ENCODER_COUNT; i++) {
		variables[`encoder_${i}_text1`] = { name: `Encoder ${i} Text 1` }
		variables[`encoder_${i}_text2`] = { name: `Encoder ${i} Text 2` }
	}

	self.setVariableDefinitions(variables)
}
