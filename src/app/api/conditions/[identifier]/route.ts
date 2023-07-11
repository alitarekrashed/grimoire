import Condition from '@/models/condition'
import { Equipment } from '@/models/equipment'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { identifier: string } }
) {
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

const allConditions: Condition[] = [
  {
    identifier: 'fleeing',
    name: 'fleeing',
    description:
      "You're forced to run away due to fear or some other compulsion. On your turn, you must spend each of your actions trying to escape the source of the fleeing condition as expediently as possible (such as by using move actions to flee, or opening doors barring your escape). The source is usually the effect or caster that gave you the condition, though some effects might define something else as the source. You can't Delay or Ready while fleeing.",
    source: {
      title: 'Core Rulebook',
      page: '620',
    },
  },
]
