import { EntityModel, ModelType } from '@/models/db/entity-model'
import { baseApiRouteFactory } from '../entity-url.factory'

export function retrieveEntity(
  key: string,
  type: ModelType
): Promise<EntityModel> {
  return (async () => {
    const url: string = baseApiRouteFactory(type)!
    const entities = await (await fetch(`${url}?name=${key}`)).json()
    return entities.length > 0 ? entities[0] : undefined
  })()
}
