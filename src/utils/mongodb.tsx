import { EntityModel } from '@/models/entity-model'
import { Collection, Db, MongoClient } from 'mongodb'

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
