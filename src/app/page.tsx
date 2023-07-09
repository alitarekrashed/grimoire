'use client'

import { Equipment } from '@/models/equipment'
import * as Separator from '@radix-ui/react-separator'

export default function Home() {
  const magnifyingGlass: Equipment = {
    name: 'Magnifying glass',
    description:
      'This quality handheld lens gives you a +1 item bonus to Perception checks to notice minute details of documents, fabric, and the like.',
    price: '40gp',
    bulk: '-',
    level: 3,
    source: 'Core Rulebook (288)',
    category: 'Adventuring Gear',
    hands: '1',
  }

  return (
    <main>
      <div className="flex justify-center pt-5">
        <p className="text-5xl">grimoire</p>
      </div>
      <div>
        <div className="container mx-auto mt-6">
          <div className="grid grid-cols-1 w-128">
            {/* style header!!! */}
            <div className="grid grid-cols-2 justify-between">
              <div className="justify-self-start">{magnifyingGlass.name}</div>
              <div className="justify-self-end">
                Item {magnifyingGlass.level}
              </div>
            </div>
            <div>
              <p>Source: {magnifyingGlass.source}</p>
            </div>
            <div>
              <div>
                Bulk: {magnifyingGlass.bulk}; Hands: {magnifyingGlass.hands}
              </div>
            </div>
            <Separator.Root
              className="w-full bg-zinc-600	h-px"
              style={{ margin: '15px 0' }}
            />
            <div>{magnifyingGlass.description}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
