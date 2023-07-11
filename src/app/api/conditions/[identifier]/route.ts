import Condition from '@/models/condition'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  const allConditions = await (
    await fetch('http://localhost:3000/api/conditions')
  ).json()
  const data = allConditions.find(
    (condition: Condition) => condition.identifier === params.identifier
  )

  if (data) {
    return NextResponse.json(data)
  } else {
    return new Response(null, {
      status: 404,
    })
  }
}
