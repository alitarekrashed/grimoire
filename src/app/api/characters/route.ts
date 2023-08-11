import { createCharacter, getAllCharacters } from '@/utils/services/db.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json(await getAllCharacters())
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  delete body._id
  const data = await createCharacter(body)

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
