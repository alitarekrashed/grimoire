import { Currency } from '@/models/db/equipment'

export function getPriceValue(value: Currency[] | undefined) {
  let monetaryValue = ''
  if (value) {
    value.forEach((element, index) => {
      if (index > 0) {
        monetaryValue = monetaryValue.concat(', ')
      }
      monetaryValue = monetaryValue.concat(`${element.value} ${element.type}`)
    })
  }
  return monetaryValue
}
