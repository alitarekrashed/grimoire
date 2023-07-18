import Trait from '@/models/trait'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  let data = allTraits

  if (name) {
    data = allTraits.filter((trait) => trait.name === name)
  }

  return NextResponse.json(data)
}

const allTraits: Trait[] = [
  {
    id: '1',
    name: 'invested',
    description:
      'A character can wear only 10 magical items that have the invested trait. None of the magical effects of the item apply if the character hasn’t invested it, nor can it be activated, though the character still gains any normal benefits from wearing the physical item (like a hat keeping rain off their head).',
    source: [
      {
        title: 'Core Rulebook',
        page: '633',
      },
    ],
    entity_type: 'TRAIT',
  },
  {
    id: '2',
    name: 'magical',
    description:
      'Something with the magical trait is imbued with magical energies not tied to a specific tradition of magic. A magical item radiates a magic aura infused with its dominant school of magic. <br/><br/>Some items or effects are closely tied to a particular tradition of magic. In these cases, the item has the @trait:arcane@, @trait:divine@, @trait:occult@, or @trait:primal@ trait instead of the magical trait. Any of these traits indicate that the item is magical.',
    source: [
      {
        title: 'Core Rulebook',
        page: '633',
      },
    ],
    entity_type: 'TRAIT',
  },
]
