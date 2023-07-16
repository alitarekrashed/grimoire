import { Currency } from '@/models/equipment'
import CardLabel from '../card/card-label'

export function PriceLabel({ value }: { value: Currency[] | undefined }) {
  let monetaryValue = ''
  if (value) {
    value.forEach((element, index) => {
      if (index > 0) {
        monetaryValue = monetaryValue.concat(', ')
      }
      monetaryValue = monetaryValue.concat(`${element.value} ${element.type}`)
    })
  }

  return value ? (
    <div>
      <CardLabel label="Price" value={monetaryValue}></CardLabel>
    </div>
  ) : (
    <></>
  )
}
