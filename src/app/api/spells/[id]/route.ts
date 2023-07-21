import { Equipment } from '@/models/equipment'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const allSpells = await (
    await fetch('http://localhost:3000/api/spells', {
      cache: 'no-store',
    })
  ).json()
  const data = allSpells.find((spells: Spell) => spells.id === params.id)

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
