import { Character } from '@/models/character'
import {
  getCharacterById,
  updateCharacterById,
} from '@/utils/services/db.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await getCharacterById(params.id)

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  delete body._id
  const data = await updateCharacterById(params.id, body)

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
