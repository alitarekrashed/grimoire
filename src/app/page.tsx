'use client'

import { EntityModel } from '@/models/entity-model'
import { ysabeau, roboto_serif } from '@/utils/fonts'
import { CardFactory } from '@/utils/services/card-factory'
import { useEffect, useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`http://localhost:3000/api?q=${query}`, {
          cache: 'no-store',
        })
          .then((result) => result.json())
          .then((val) => {
            console.log(val)
            setSuggestions(val)
          })
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [query])

  return (
    <div className={`h-full ${ysabeau.className}`}>
      <div className="flex place-content-center">
        <input
          className="text-stone-800 rounded h-10 w-144 box-border pl-1"
          type="text"
          placeholder="Search for an item"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
      </div>
      <div className={`p-5 ${roboto_serif.className} font-normal`}>
        {suggestions.map((card: EntityModel) => (
          <div key={card._id.toString()} className="pb-4">
            {CardFactory<T>({
              card: card,
              collapsible: true,
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
