import Condition from '@/models/condition'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json(allConditions)
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
  {
    identifier: 'dazzled',
    name: 'dazzled',
    description:
      'Your eyes are overstimulated. If vision is your only precise sense, all creatures and objects are @condition:concealed@ from you.',
    source: {
      title: 'Core Rulebook',
      page: '619',
    },
  },
  {
    identifier: 'blinded',
    name: 'blinded',
    description:
      "You can't see. All normal terrain is difficult terrain to you. You can't detect anything using vision. You automatically critically fail Perception checks that require you to be able to see, and if vision is your only precise sense, you take a –4 status penalty to Perception checks. You are immune to visual effects. Blinded overrides @condition:dazzled@.",
    source: {
      title: 'Core Rulebook',
      page: '618',
    },
  },
]
