import Condition from '@/models/condition'
import { getEntitiesCollection } from '@/utils/mongodb'
import { Collection, Filter, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const collection: Collection<Condition> =
    await getEntitiesCollection<Condition>()

  let data: Condition | null = await collection.findOne({
    _id: new ObjectId(params.id),
  })

  console.log('*********')
  console.log(data)

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
