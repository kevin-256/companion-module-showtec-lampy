import { InstanceBase, type SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ShowtecLampyConfig } from './config.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { OSCConnection } from './osc.js'

export type ShowtecLampySchema = {
	config: ShowtecLampyConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

export default class ShowtecLampyInstance extends InstanceBase<ShowtecLampySchema> {
	config!: ShowtecLampyConfig
	osc!: OSCConnection // add this

	async init(config: ShowtecLampyConfig): Promise<void> {
		this.config = config
		this.osc = new OSCConnection(this)
		this.osc.init()

		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()
	}

	async destroy(): Promise<void> {
		this.osc?.destroy()
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ShowtecLampyConfig): Promise<void> {
		this.config = config
		this.osc.init()
		this.updateActions()
		this.updateVariableDefinitions()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}
