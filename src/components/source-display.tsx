import { Source } from '@/models/equipment'

export default function SourceDisplay({ value }: { value: Source }) {
  return (
    <p className="text-[9px] italic justify-self-end">
      <span>Source:</span> {value.title} ({value.page})
    </p>
  )
}
