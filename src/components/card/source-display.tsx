import { Source } from '@/models/equipment'

export default function SourceDisplay({ value }: { value: Source }) {
  return (
    <p className="italic">
      <span>Source:</span> {value.title} ({value.page})
    </p>
  )
}
