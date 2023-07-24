import { getEntityById } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const allTraits = await (
    await fetch('http://localhost:3000/api/traits', { cache: 'no-store' })
  ).json()
  const data = await getEntityById(params.id, ['TRAIT'])

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
