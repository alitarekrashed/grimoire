'use client'

import { ysabeau } from '@/utils/fonts'
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
      <h2 className="text-3xl text-center">Search for something!</h2>

      <div className="mt-5 flex place-content-center">
        <input
          className="text-stone-800"
          type="text"
          placeholder="Search data..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
