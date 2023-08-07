import { getAllEntities } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? undefined
  const traits: string[] | undefined =
    searchParams.getAll('traits') ?? undefined

  let resolvedTraits = traits.length > 0 ? traits[0].split(',') : []
  return NextResponse.json(await getAllEntities(['FEAT'], name, resolvedTraits))
}
