import HoverableImage from '@/components/base/hoverable-image'
import { CurrencyMetadata, getCurrencyMetadata } from './money-utils'
import Image from 'next/image'
import { CurrencyType } from '@/models/db/equipment'

export default function CurrencyImage({
  type,
  hoverable,
}: {
  type: CurrencyType
  hoverable: boolean
}) {
  const currency: CurrencyMetadata | undefined = getCurrencyMetadata(type)

  // what i really want to do is make the alt text hoverable...
  if (currency) {
    if (hoverable) {
      return (
        <HoverableImage
          src={`/${currency.file}.png`}
          width={20}
          height={20}
          alt={currency.name}
          className="inline"
        ></HoverableImage>
      )
    } else {
      return (
        <Image
          src={`/${currency.file}.png`}
          width={20}
          height={20}
          alt={currency.name}
          className="inline"
        ></Image>
      )
    }
  }
  return undefined
}
