'use client'

import { Spell } from '@/models/spell'
import { CardFactory } from '@/utils/services/card-factory'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SpellRecordPage() {
  const [spell, setSpell] = useState<Spell>()
  const path: string[] = usePathname().split('/')

  useEffect(() => {
    const id = path[path.length - 1]
    fetch(`http://localhost:3000/api/spells/${id}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((spell) => {
        setSpell(spell)
      })
  }, [])

  return (
    <div className="p-4">
      {spell &&
        CardFactory<Spell>({
          card: spell,
          contentTextSizeClassName: 'md',
          collapsible: false,
        })}
    </div>
  )
}
