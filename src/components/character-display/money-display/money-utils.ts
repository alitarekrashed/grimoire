import { CurrencyType } from '@/models/db/equipment'

export interface CurrencyMetadata {
  file: string
  name: string
  additional: string[]
}

export function getCurrencyMetadata(
  type: CurrencyType
): CurrencyMetadata | undefined {
  switch (type) {
    case 'cp':
      return {
        file: 'copper-coin',
        name: 'Copper',
        additional: ['1 sp = 10 cp', '1 gp = 100 cp', '1 pp = 1000 cp'],
      }
    case 'sp':
      return {
        file: 'silver-coin',
        name: 'Silver',
        additional: ['1 gp = 10 sp', '1 pp = 100 sp'],
      }
    case 'gp':
      return { file: 'gold-coin', name: 'Gold', additional: [] }
    case 'pp':
      return {
        file: 'platinum-coin',
        name: 'Platinum',
        additional: ['1 pp = 10 gp'],
      }
    default:
      return undefined
  }
}
