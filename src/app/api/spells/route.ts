import { Spell } from '@/models/spell'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json(allSpells)
}

const allSpells: Spell[] = [
  {
    id: '1',
    name: 'electric arc',
    traits: ['cantrip', 'electric', 'evocation'],
    traditions: ['arcane', 'primal'],
    activation: {
      num_actions: 'two',
      action: 'Cast a Spell',
      range: {
        value: 30,
        unit: 'feet',
      },
      targets: '1 or 2 creatures',
    },
    saving_throw: 'basic Reflex',
    description:
      'An arc of lightning leaps from one target to another. You deal electricity damage equal to 1d4 plus your spellcasting ability modifier.',
    heightened: {
      level_modifier: 1,
      description: 'The damage increases by 1d4.',
    },
    rank: 0,
    source: [{ title: 'Core Rulebook', page: '335' }],
    entity_type: 'SPELL',
  },
]
