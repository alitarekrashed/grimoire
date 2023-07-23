import Condition from '@/models/condition'
import { getEntitiesCollection, getEntityById } from '@/utils/mongodb'
import { Collection, Filter, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await getEntityById(params.id)

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
