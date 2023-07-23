import Condition from '@/models/condition'
import { getEntitiesCollection } from '@/utils/mongodb'
import { Collection, FindCursor } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  const collection: Collection<Condition> =
    await getEntitiesCollection<Condition>()

  let search: Filter<Condition> = {}
  if (name) {
    search['name'] = name
  }
  let data: Condition[] = await collection
    .find(search)
    .sort('name', 1)
    .toArray()

  return NextResponse.json(data)
}
