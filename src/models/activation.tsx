export type RangeUnit = 'feet' | 'touch'
export type DurationUnit = 'minutes'
export type AreaUnit = 'emanataion'
export type Targets = '1 or 2 creatures' | '1 creature'
export type SavingThrowType = 'basic Reflex'
export type ActionName = 'Interact' | 'Cast a Spell'
export type ActionType =
  | 'one'
  | 'one-to-three'
  | 'two'
  | 'three'
  | 'reaction'
  | 'free'
  | '10 minutes'

export interface Activation {
  num_actions: ActionType
  action?: ActionName
  traits?: string[]
  frequency?: string // should this be an enum?
  trigger?: string
  effect?: Effect
  targets?: Targets
  range?: RangeDefinition
  area?: AreaDefinition
  duration?: DurationDefinition
  requirements?: string
  override_label?: string
}

export interface Effect {
  description: string
  saving_throw?: SavingThrow
}

export interface SavingThrow {
  critical_success?: string
  success?: string
  failure?: string
  critical_failure?: string
}

export interface RangeDefinition {
  value?: number
  unit: RangeUnit
}

export interface AreaDefinition {
  value: number
  unit: AreaUnit
}

export interface DurationDefinition {
  value: number
  unit: DurationUnit
}
