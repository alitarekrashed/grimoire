import { searchAllEntities } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? undefined
  const ancestry = searchParams.get('ancestry') ?? undefined

  let search = {}

  if (name) {
    search = {
      ...search,
      name: name,
    }
  }

  if (ancestry) {
    search = {
      ...search,
      ancestry: ancestry,
    }
  }

  return NextResponse.json(await searchAllEntities(['HERITAGE'], search))
}
