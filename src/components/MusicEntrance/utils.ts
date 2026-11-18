export function formatActiveYears(activeYears: number[]): string {
  const years = [...new Set(activeYears)].sort((first, second) => first - second)
  if (years.length === 0) {
    return ''
  }

  const ranges: string[] = []
  let rangeStart = years[0]
  let rangeEnd = years[0]

  for (const year of years.slice(1)) {
    if (year === rangeEnd + 1) {
      rangeEnd = year
      continue
    }

    ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart} - ${rangeEnd}`)
    rangeStart = year
    rangeEnd = year
  }

  ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart} - ${rangeEnd}`)
  return ranges.join(', ')
}
