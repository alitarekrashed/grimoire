import { Collection, Db, Filter, MongoClient, ObjectId, WithId } from 'mongodb'
import { EntityModel } from '@/models/entity-model'
import clientPromise from '../mongodb'

async function getDatabase(): Promise<Db> {
  const client: MongoClient = await clientPromise
  return client.db('grimoire')
}

export async function getEntitiesCollection<T extends EntityModel>(): Promise<
  Collection<T>
> {
  const db: Db = await getDatabase()
  return db.collection('entities')
}

export async function searchEntities(search?: string): Promise<EntityModel[]> {
  const collection = await getEntitiesCollection<EntityModel>()

  let query = {}
  query = { ...query, name: { $regex: search, $options: 'i' } }
  return collection.find(query).toArray()
}

export async function getAllEntities<T extends EntityModel>(
  entity_types: ModelType[],
  name?: string
): Promise<WithId<T>[]> {
  const collection = await getEntitiesCollection<T>()

  let search: Filter<T> = {}
  search = {
    ...search,
    entity_type: {
      $in: entity_types,
    },
  }
  if (name) {
    search = {
      ...search,
      name: name,
    }
  }
  return collection.find(search).sort('name', 1).toArray()
}

export async function getEntityById<T extends EntityModel>(
  id: string | ObjectId,
  entity_types: ModelType[]
): Promise<WithId<T> | null> {
  const collection: Collection<T> = await getEntitiesCollection<T>()

  let search: Filter<T> = {}
  search = {
    ...search,
    _id: new ObjectId(id),
    entity_type: {
      $in: entity_types,
    },
  }

  return await collection.findOne(search)
}