import { searchEntities } from '@/utils/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q') ?? undefined

  return NextResponse.json(await searchEntities(search))
}
