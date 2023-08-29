import { EntityModel, ModelType } from '@/models/db/entity-model'
import { baseApiRouteFactory } from '../entity-url.factory'

export function retrieveEntity(
  key: string,
  type: ModelType
): Promise<EntityModel> {
  const value = type === 'TRAIT' ? key.split(' ')[0] : key
  return (async () => {
    const url: string = baseApiRouteFactory(type)!
    const entities = await (await fetch(`${url}?name=${value}`)).json()
    return entities.length > 0 ? entities[0] : undefined
  })()
}

export function retrieveEntityByNames(
  names: string[],
  type: ModelType
): Promise<EntityModel[]> {
  return (async () => {
    const url: string = baseApiRouteFactory(type)!
    const entities = await (await fetch(`${url}?names=${names}`)).json()
    return entities ?? []
  })()
}

export function retrieveSpellsByTraditionAndRank(
  traditions: string[],
  ranks: string[]
): Promise<EntityModel[]> {
  return (async () => {
    const url: string = baseApiRouteFactory('SPELL')!
    const entities = await (
      await fetch(`${url}?traditions=${traditions}&ranks=${ranks}`)
    ).json()
    return entities ?? []
  })()
}
