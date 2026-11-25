import type { ReactNode } from 'react'

export const musicCategories = ['All', 'Band', 'Artist', 'Album', 'Song', 'Genre'] as const
export type MusicCategory = (typeof musicCategories)[number]

const categoryIcons: Record<MusicCategory, ReactNode> = {
  All: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  ),
  Band: <i className="fa-solid fa-people-group" aria-hidden="true" />,
  Artist: <i className="fa-solid fa-microphone" aria-hidden="true" />,
  Album: <i className="fa-solid fa-record-vinyl" aria-hidden="true" />,
  Song: <i className="fa-solid fa-music" aria-hidden="true" />,
  Genre: <i className="fa-solid fa-icons" aria-hidden="true" />,
}

export function getMusicCategoryIcon(category: string): ReactNode {
  return musicCategories.includes(category as MusicCategory)
    ? categoryIcons[category as MusicCategory]
    : null
}
