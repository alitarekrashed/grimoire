import { getAllEntities } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? undefined

  return NextResponse.json(await getAllEntities(['ACTION'], name))
}
