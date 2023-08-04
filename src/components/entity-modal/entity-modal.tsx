'use client'

import { EntityModel } from '@/models/db/entity-model'
import { CardFactory } from '@/utils/services/card-factory'
import { Modal, ModalCloseButton } from '../modal/modal'

export function EntityModal<T extends EntityModel>({ value }: { value: T }) {
  const trigger = (
    <span className="underline" tabIndex={0}>
      {value.name}
    </span>
  )
  const body = (
    <div className="p-4">
      {CardFactory({
        card: value,
        contentTextSizeClassName: 'md',
        collapsible: false,
      })}
    </div>
  )
  return (
    <Modal
      size="small"
      trigger={trigger}
      body={body}
      closeButtons={[<ModalCloseButton label="Close"></ModalCloseButton>]}
    ></Modal>
  )
}
