import { EntityModel, ModelType } from '@/models/entity-model'
import {
  Collection,
  Condition,
  Db,
  Filter,
  MongoClient,
  ObjectId,
  WithId,
} from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('Add Mongo URI to .env.local')
}

const client: MongoClient = new MongoClient(uri)
const clientPromise: Promise<MongoClient> = client.connect()

export async function getDatabase(): Promise<Db> {
  let client: MongoClient = await clientPromise
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
