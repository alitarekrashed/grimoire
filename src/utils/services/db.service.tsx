import {
  Collection,
  Db,
  Filter,
  MongoClient,
  ObjectId,
  UpdateResult,
  Document,
  WithId,
  InsertOneResult,
  DeleteResult,
} from 'mongodb'
import { EntityModel, ModelType } from '@/models/db/entity-model'
import clientPromise from '../mongodb'
import { CharacterEntity } from '@/models/db/character-entity'

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
  name?: string,
  traits?: string[]
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
      name: { $regex: name, $options: 'i' },
    }
  }
  if (traits && traits.length > 0) {
    search = {
      ...search,
      traits: { $in: traits },
    }
  }
  return collection.find(search).sort('name', 1).toArray()
}

export async function searchAllEntities<T extends EntityModel>(
  entity_types: ModelType[],
  search?: any
): Promise<WithId<T>[]> {
  const collection = await getEntitiesCollection<T>()

  let query: Filter<T> = {}

  if (search) {
    query = {
      ...search,
      entity_type: {
        $in: entity_types,
      },
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

export async function getCharactersCollection<Character>(): Promise<
  Collection<T>
> {
  const db: Db = await getDatabase()
  return db.collection('characters')
}

export async function getAllCharacters(): Promise<WithId<CharacterEntity>[]> {
  const collection = await getCharactersCollection()

  return collection.find().sort('name', 1).toArray()
}

export async function getCharacterById(
  id: string | ObjectId
): Promise<WithId<CharacterEntity> | null> {
  const collection: Collection<CharacterEntity> =
    await getCharactersCollection()

  let search: Filter<CharacterEntity> = {}
  search = {
    ...search,
    _id: new ObjectId(id),
  }

  return await collection.findOne(search)
}

export async function createCharacter(
  character: CharacterEntity
): Promise<InsertOneResult<CharacterEntity>> {
  const collection: Collection<CharacterEntity> =
    await getCharactersCollection()

  return await collection.insertOne(character)
}

export async function updateCharacterById(
  id: string | ObjectId,
  character: CharacterEntity
): Promise<Document | UpdateResult<CharacterEntity>> {
  const collection: Collection<CharacterEntity> =
    await getCharactersCollection()

  let search: Filter<CharacterEntity> = {}
  search = {
    ...search,
    _id: new ObjectId(id),
  }

  return await collection.replaceOne(search, character)
}

export async function deleteCharacterById(
  id: string | ObjectId
): Promise<DeleteResult> {
  const collection: Collection<CharacterEntity> =
    await getCharactersCollection()

  let search: Filter<CharacterEntity> = {}
  search = {
    ...search,
    _id: new ObjectId(id),
  }

  return await collection.deleteOne(search)
}
