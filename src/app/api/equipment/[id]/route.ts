import { Equipment } from '@/models/equipment'
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
  const data = allEquipment.find(
    (equipment: Equipment) => equipment._id === params.id
  )

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
