import { EntityModel } from '@/models/entity-model'

export function SearchResult<T extends EntityModel>({ data }: { data: T }) {
  return (
    <div className="flex justify-between">
      <span>{data.name}</span> <span>{data.entity_type}</span>
    </div>
  )
}
