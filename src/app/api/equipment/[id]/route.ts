import { Equipment } from '@/models/equipment'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const allConditions = await (
    await fetch('http://localhost:3000/api/equipment?keepCollapsed=true', {
      cache: 'no-store',
    })
  ).json()
  const data = allConditions.find(
    (equipment: Equipment) => equipment.id === params.id
  )

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
