import { CharacterEntity } from '@/models/db/character-entity'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function CharacterContextMenu({
  character,
}: {
  character: CharacterEntity
}) {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const wrapperRef = useRef(null)

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false)
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const handleCopy = (characterEntity: CharacterEntity) => (e: any) => {
    console.log(characterEntity)
  }

  const handleView = (characterEntity: CharacterEntity) => (e: any) => {
    router.push(`/characters/${characterEntity._id}`)
  }

  useOutsideAlerter(wrapperRef)

  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        className="bg-stone-700 rounded-full px-[8px] border border-stone-300 hover:bg-stone-500"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <FontAwesomeIcon size="2xs" icon={faEllipsis} />
      </button>
      {open && (
        <div
          ref={wrapperRef}
          className="bg-stone-600 border border-stone-300 -mt-3 ml-3 rounded-md fixed w-32 h-32 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-row-3">
            <div
              className="border-b border-stone-300 text-center rounded-t-md hover:bg-stone-300/30 cursor-pointer"
              onClick={handleView(character)}
            >
              View
            </div>
            <div
              className="border-b border-stone-300 text-center hover:bg-stone-300/30 cursor-pointer"
              onClick={handleCopy(character)}
            >
              Copy
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
