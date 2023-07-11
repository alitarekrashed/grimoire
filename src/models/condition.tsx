import { Source } from './equipment'

export default interface Condition {
  identifier: string
  name: string
  description: string
  source: Source
}
