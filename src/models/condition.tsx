import { Source } from './equipment'

export default interface Condition {
  id: string
  name: string
  description: string
  source: Source
}
