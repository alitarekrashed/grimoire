import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function NewCharacterButton() {
  return (
    <button className="p-1 pr-5 rounded-md bg-stone-800 border border-stone-300 hover:bg-stone-600">
      <FontAwesomeIcon className="mr-1" size="2xs" icon={faPlus} />
      New
    </button>
  )
}
