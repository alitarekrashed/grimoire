export interface EntityModel {
  id: string
  name: string
  description: string
  source: Source[]
  entity_type: 'EQUIPMENT' | 'EQUIPMENT_WITH_VARIANTS' | 'CONDITION' | 'TRAIT'
}

export interface Source {
  title: string
  page?: string
}
