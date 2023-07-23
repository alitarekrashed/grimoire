import { EntityModel } from '@/models/entity-model'
import { Collection, Db, Filter, MongoClient, ObjectId, WithId } from 'mongodb'

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

export async function getAllEntities<T extends EntityModel>(
  name?: string
): Promise<WithId<T>[]> {
  const collection = await getEntitiesCollection<T>()

  let search: Filter<T> = {}
  if (name) {
    search = {
      ...search,
      name: name,
    }
  }
  return collection.find(search).sort('name', 1).toArray()
}

export async function getEntityById<T extends EntityModel>(
  id: string | ObjectId
): Promise<WithId<T>[]> {
  const collection: Collection<Condition> =
    await getEntitiesCollection<Condition>()

  return await collection.findOne({
    _id: new ObjectId(id),
  })
}
