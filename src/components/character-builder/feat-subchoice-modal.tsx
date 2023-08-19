import { Feat } from '@/models/db/feat'
import { Modal } from '../modal/modal'
import { roboto_condensed } from '@/utils/fonts'
import * as Select from '@radix-ui/react-select'
import { ChoiceSelect } from '../choice-select/choice-select'

export function FeatSubChoiceModal({ feat }: { feat: Feat }) {
  return (
    <ChoiceSelect
      title={feat.configuration!.title}
      options={feat.configuration?.options!}
    ></ChoiceSelect>
  )
}
