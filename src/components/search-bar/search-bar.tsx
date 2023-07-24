import { EntityModel } from '@/models/entity-model'
import { roboto_serif } from '@/utils/fonts'
import { CardFactory } from '@/utils/services/card-factory'
import { useEffect, useState } from 'react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [hideSuggestions, setHideSuggestions] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 2) {
        try {
          await fetch(`http://localhost:3000/api?q=${query}`, {
            cache: 'no-store',
          })
            .then((result) => result.json())
            .then((val) => {
              setSuggestions(val)
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        setSuggestions([])
      }
    }

    fetchData()
  }, [query])

  return (
    <>
      <div className="grid grid-cols-1">
        <div className="justify-self-center">
          <input
            className="bg-stone-800 rounded h-10 w-144 box-border pl-1 justify-self-center focus:transition-all focus:duration-200 focus:ease-in-out"
            type="text"
            placeholder="Search for an item"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
          />
          {hideSuggestions === false && suggestions.length > 0 && (
            <div
              className={`font-normal max-h-80 h-fit overflow-y-scroll bg-stone-800 rounded-b-lg border-b border-stone-300`}
            >
              {suggestions.map((suggestion: EntityModel) => (
                <div
                  className="p-1 border-x border-t border-stone-300 hover:bg-stone-700"
                  key={suggestion._id.toString()}
                >
                  {suggestion['name']}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
