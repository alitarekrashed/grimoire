import { Button } from '@/components/base/button'

export function RefocusButton({
  disabled,
  onClick,
}: {
  disabled?: boolean
  onClick: () => void
}) {
  return <Button disabled={disabled} label="REFOCUS" onClick={onClick} />
}
