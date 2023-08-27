import { getEntitiesByNames } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const names: string[] | undefined = searchParams.getAll('names') ?? undefined

  let resolvedNames = names.length > 0 ? names[0].split(',') : []

  return NextResponse.json(await getEntitiesByNames(['SPELL'], resolvedNames))
}
