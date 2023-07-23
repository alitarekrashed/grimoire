import { getEntityById } from '@/utils/mongodb'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const allEquipment = await (
    await fetch('http://localhost:3000/api/equipment?keepCollapsed=true', {
      cache: 'no-store',
    })
  ).json()
  const data = await getEntityById(params.id, [
    'EQUIPMENT',
    'EQUIPMENT_WITH_VARIANTS',
  ])

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
