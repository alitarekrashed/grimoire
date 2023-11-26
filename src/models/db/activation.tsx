export type RangeUnit = 'feet' | 'touch'
export type DurationUnit = 'minutes' | 'sustained'
export type AreaType = 'emanation' | 'burst' | 'line'
export type AreaUnit = 'foot'
export type Targets = '1 or 2 creatures' | '1 creature'
export type SavingThrowType = 'basic Reflex'
export type DefenseType = SavingThrowType | 'AC'
export type ActionName = 'Interact' | 'Cast a Spell' | 'Downtime'
export type ActionType =
  | 'one'
  | 'one-to-three'
  | 'one-or-two'
  | 'two'
  | 'three'
  | 'reaction'
  | 'free'
  | '10 minutes'
  | '1 minute'
  | ''
export type Tag =
  | 'Augment' // Increases you or an ally's bonus
  | 'Debilitate' // Decreases an enemy's bonuses
  | 'Defensive' // Increases AC or saving throw bonuses
  | 'Downtime' // used in downtime
  | 'Encounter' // used in encounters
  | 'Healing' // heals HP
  | 'Interaction' // interacts with objects
  | 'Movement' // allows you to move or increase your movement
  | 'Offensive' // involves making strikes or attacks
  | 'Support' // supports your allies

export function isActionLongerThanTurn(type: ActionType) {
  switch (type) {
    case '10 minutes':
      return true
    case '1 minute':
      return true
    default:
      return false
  }
}

export interface Activation {
  num_actions: ActionType
  action?: ActionName
  traits?: string[]
  frequency?: string // should this be an enum?
  trigger?: string
  effect?: Effect
  targets?: Targets
  range?: RangeDefinition
  defense?: DefenseType
  area?: AreaDefinition
  duration?: DurationDefinition
  tags?: Tag[]
  requirements?: string
  override_label?: string
}

export interface Effect {
  description?: string
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
  type?: AreaType
  variable?: boolean
}

export interface DurationDefinition {
  value: number
  unit: DurationUnit
  sustained?: boolean
}
