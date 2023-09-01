import { getEntitiesByNames, getSpells } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const names: string[] | undefined = searchParams.getAll('name') ?? undefined
  const traditions: string[] | undefined =
    searchParams.getAll('traditions') ?? undefined
  const ranks: string[] | undefined = searchParams.getAll('ranks') ?? undefined

  let resolvedNames = names.length > 0 ? names[0].split(',') : []
  let resolvedRanks = ranks.length > 0 ? ranks[0].split(',') : []
  let resolvedTraditions = traditions.length > 0 ? traditions[0].split(',') : []

  return NextResponse.json(
    await getSpells(resolvedNames, resolvedTraditions, resolvedRanks)
  )
}
