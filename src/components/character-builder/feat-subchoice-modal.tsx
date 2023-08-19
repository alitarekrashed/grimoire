import { Feat } from '@/models/db/feat'
import { Modal } from '../modal/modal'
import { roboto_condensed } from '@/utils/fonts'

export function FeatSubChoiceModal({ feat }: { feat: Feat }) {
  return (
    <>
      <Modal
        size="xsmall"
        trigger={
          <button
            className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 hover:bg-stone-600"
            tabIndex={0}
          >
            <span className="text-stone-300 absolute top-0 text-[9px]">
              {feat.configuration!.title}
            </span>
            {/* <span className="absolute bottom-0">{saved && saved.name}</span> */}
          </button>
        }
        body={
          <div
            className={`${roboto_condensed.className} grid grid-rows-1 grid-cols-8 h-full min-h-full w-full`}
          >
            {feat.configuration?.options}
          </div>
        }
        closeButtons={[]}
      ></Modal>
    </>
  )
}
