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
      traits: ['somatic', 'verbal'],
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
      type: 'formula',
      value: {
        level_modifier: 1,
        description: 'The damage increases by 1d4.',
      },
    },
    rank: 0,
    source: [{ title: 'Core Rulebook', page: '335' }],
    entity_type: 'SPELL',
  },
  {
    id: '2',
    name: 'detect magic',
    traits: ['cantrip', 'detection', 'divination'],
    traditions: ['arcane', 'primal', 'divine', 'occult'],
    activation: {
      num_actions: 'two',
      action: 'Cast a Spell',
      traits: ['somatic', 'verbal'],
      area: {
        value: 30,
        unit: 'emanataion',
      },
    },
    description:
      "You send out a pulse that registers the presence of magic. You receive no information beyond the presence or absence of magic. You can choose to ignore magic you're fully aware of, such as the magic items and ongoing spells of you and your allies.<br/><br/>You detect @trait:illusion@ magic only if that magic's effect has a lower level than the level of your <i>detect magic</i> spell. However, items that have an illusion aura but aren't deceptive in appearance (such as an @equipment:invisibility potion@) typically are detected normally.",
    heightened: {
      type: 'explicit',
      value: [
        {
          level: 3,
          description:
            'You learn the school of magic for the highest-level effect within range that the spell detects. If multiple effects are equally strong, the GM determines which you learn.',
        },
        {
          level: 4,
          description:
            "As 3rd level, but you also pinpoint the source of the highest-level magic. Like for an imprecise sense, you don't learn the exact location, but can narrow down the source to within a 5-foot cube (or the nearest if larger than that).",
        },
      ],
    },
    rank: 0,
    source: [{ title: 'Core Rulebook', page: '328' }],
    entity_type: 'SPELL',
  },
]