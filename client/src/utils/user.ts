export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  const first = words[0]
  const last = words.length > 1 ? words[words.length - 1] : undefined

  const initial = (word?: string) =>
    word ? Array.from(word)[0]!.toUpperCase() : ''

  return initial(first) + initial(last)
}
