import { Source } from '@/models/entity-model'

export default function SourceDisplay({ value }: { value: Source[] }) {
  return (
    <p className="italic">
      <span>Source:</span> {value[0].title} ({value[0].page})
    </p>
  )
}
