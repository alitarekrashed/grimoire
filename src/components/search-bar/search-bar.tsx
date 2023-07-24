import { EntityModel } from '@/models/entity-model'
import { ChangeEvent, useEffect, useState } from 'react'
import { SearchResult } from './search-result'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/utils/debounce'

export function SearchBar({ size }: { size?: 'small' | 'large' }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [hideSuggestions, setHideSuggestions] = useState(false)

  const debouncedRequest = useDebounce(() => {
    const fetchData = async () => {
      if (query.length >= 1) {
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
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    debouncedRequest()
  }
  return (
    <>
      <div className="grid grid-cols-1">
        <div className="justify-self-center">
          {/* TODO: add animation to fade in/out during focus and onBlur? */}
          <input
            className={`bg-stone-800 rounded-lg h-10 ${
              size === 'small' ? 'w-80' : 'w-144'
            } box-border pl-1 justify-self-center focus:transition-all focus:duration-200 focus:ease-in-out`}
            type="text"
            placeholder="Search for an item"
            value={query}
            onChange={onChange}
            onFocus={() => setHideSuggestions(false)}
            onBlur={async () => {
              setTimeout(() => {
                setHideSuggestions(true)
              }, 200)
            }}
          />
          {hideSuggestions === false && suggestions.length > 0 && (
            <div
              className={`z-10 ${
                size === 'small' ? 'w-80' : 'w-144'
              } font-normal absolute max-h-80 h-fit overflow-y-scroll bg-stone-800 rounded-b-lg border-b border-stone-300`}
            >
              {suggestions.map((suggestion: EntityModel) => (
                <SearchResult
                  key={suggestion._id.toString()}
                  data={suggestion}
                  handleClick={() =>
                    router.push(
                      `/reference/${getRoute(suggestion)}/${suggestion._id}`
                    )
                  }
                ></SearchResult>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function getRoute(data: EntityModel): string {
  switch (data.entity_type) {
    case 'EQUIPMENT':
    case 'EQUIPMENT_WITH_VARIANTS':
      return 'equipment'
    case 'SPELL':
      return 'spells'
    case 'CONDITION':
      return 'conditions'
    case 'TRAIT':
      return 'traits'
  }
}
