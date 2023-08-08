import { ModelType } from '@/models/db/entity-model'

// TODO ALI can this be a relative URL call?
export function baseApiRouteFactory(type: ModelType) {
  switch (type) {
    case 'EQUIPMENT_WITH_VARIANTS':
    case 'EQUIPMENT':
      return 'http://localhost:3000/api/equipment'
    case 'SPELL':
      return 'http://localhost:3000/api/spells'
    case 'TRAIT':
      return 'http://localhost:3000/api/traits'
    case 'CONDITION':
      return 'http://localhost:3000/api/conditions'
    case 'ANCESTRY':
      return 'http://localhost:3000/api/ancestries'
    case 'RULE':
      return 'http://localhost:3000/api/rules'
    case 'HERITAGE':
      return 'http://localhost:3000/api/heritages'
    case 'ACTION':
      return 'http://localhost:3000/api/actions'
    case 'BACKGROUND':
      return 'http://localhost:3000/api/backgrounds'
    case 'FEAT':
      return 'http://localhost:3000/api/feats'
    case 'CLASS':
      return 'http://localhost:3000/api/classes'
    default: // throw exception?
  }
}

// TODO ALI can this be a relative URL call?
export function baseRecordPageRouteFactory(type: ModelType) {
  switch (type) {
    case 'EQUIPMENT_WITH_VARIANTS':
    case 'EQUIPMENT':
      return 'http://localhost:3000/reference/equipment'
    case 'SPELL':
      return 'http://localhost:3000/reference/spells'
    case 'TRAIT':
      return 'http://localhost:3000/reference/traits'
    case 'CONDITION':
      return 'http://localhost:3000/reference/conditions'
    case 'ANCESTRY':
      return 'http://localhost:3000/reference/ancestries'
    case 'RULE':
      return 'http://localhost:3000/reference/rules'
    case 'HERITAGE':
      return 'http://localhost:3000/reference/heritages'
    case 'ACTION':
      return 'http://localhost:3000/reference/actions'
    case 'BACKGROUND':
      return 'http://localhost:3000/reference/backgrounds'
    case 'FEAT':
      return 'http://localhost:3000/reference/feats'
    case 'CLASS':
      return 'http://localhost:3000/reference/classes'
    default: // throw exception?
  }
}
