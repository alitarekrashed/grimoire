import { CharacterEntity } from '@/models/db/character-entity'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

export function CharacterContextMenu({
  character,
}: {
  character: CharacterEntity
}) {
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

  const handleClick = (characterEntity: CharacterEntity) => (e: any) => {
    console.log(characterEntity)
  }

  useOutsideAlerter(wrapperRef)

  return (
    <div className="fixed top-2 right-2">
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
          className="bg-stone-600 border border-stone-300 -mt-3 ml-3  rounded-3xl fixed w-32 h-32 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-row-3">
            <div
              className="border-b border-stone-300 text-center rounded-t-3xl hover:bg-stone-300/30 cursor-pointer"
              onClick={handleClick(character)}
            >
              Copy
            </div>
            <div className="border-b border-stone-300"></div>
            <div className="border-b border-stone-300"></div>
          </div>
        </div>
      )}
    </div>
  )
}
