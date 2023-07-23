import { getAllEntities } from '@/utils/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? undefined

  return NextResponse.json(await getAllEntities(name))
}
