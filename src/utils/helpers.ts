export function caseInsensitiveMatch(
  a: string | undefined,
  b: string | undefined
) {
  return a?.toLowerCase() === b?.toLowerCase()
}
