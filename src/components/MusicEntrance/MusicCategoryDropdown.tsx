import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import './MusicCategoryDropdown.css'

const categories = ['All', 'Band', 'Artist', 'Album', 'Song', 'Genre']

type MusicCategoryDropdownProps = {
  selectedCategory: string
  onSelect: (category: string) => void
}

function MusicCategoryDropdown({
  selectedCategory,
  onSelect,
}: MusicCategoryDropdownProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef(new Map<string, HTMLButtonElement>())

  useEffect(() => {
    if (isCategoryOpen) {
      optionRefs.current.get(categories[activeCategoryIndex])?.focus()
    }
  }, [activeCategoryIndex, isCategoryOpen])

  useEffect(() => {
    if (!isCategoryOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !categoryRef.current?.contains(event.target)) {
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isCategoryOpen])

  function openCategoryMenu() {
    const selectedIndex = categories.indexOf(selectedCategory)
    setActiveCategoryIndex(selectedIndex)
    setIsCategoryOpen(true)
  }

  function handleCategoryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isCategoryOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        openCategoryMenu()
      }
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveCategoryIndex(
        (index) => (index + direction + categories.length) % categories.length,
      )
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveCategoryIndex(event.key === 'Home' ? 0 : categories.length - 1)
    } else if (event.key === 'Escape') {
      setIsCategoryOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(categories[activeCategoryIndex])
      setIsCategoryOpen(false)
    }
  }

  return (
    <div
      ref={categoryRef}
      className="music-category"
      onKeyDown={handleCategoryKeyDown}
    >
      <button
        ref={triggerRef}
        className="music-category-trigger"
        type="button"
        aria-label={`Search category: ${selectedCategory}`}
        aria-haspopup="listbox"
        aria-expanded={isCategoryOpen}
        aria-controls="music-category-options"
        onClick={() => {
          if (isCategoryOpen) {
            setIsCategoryOpen(false)
          } else {
            openCategoryMenu()
          }
        }}
      >
        <span>{selectedCategory}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="m2 4 4 4 4-4" />
        </svg>
      </button>
      {isCategoryOpen && (
        <div
          className="music-category-options"
          id="music-category-options"
          role="listbox"
          aria-label="Search category"
        >
          {categories.map((category, index) => (
            <button
              className="music-category-option"
              id={`music-category-option-${index}`}
              key={category}
              ref={(element) => {
                if (element) {
                  optionRefs.current.set(category, element)
                } else {
                  optionRefs.current.delete(category)
                }
              }}
              type="button"
              role="option"
              aria-selected={selectedCategory === category}
              tabIndex={activeCategoryIndex === index ? 0 : -1}
              onFocus={() => setActiveCategoryIndex(index)}
              onClick={() => {
                onSelect(category)
                setIsCategoryOpen(false)
              }}
            >
              <span className="music-category-option-icon" aria-hidden="true">
                {category === 'All' && (
                  <svg viewBox="0 0 24 24">
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                )}
                {category === 'Album' && (
                  <i className="fa-solid fa-record-vinyl" aria-hidden="true" />
                )}
                {category === 'Band' && (
                  <i className="fa-solid fa-people-group" aria-hidden="true" />
                )}
                {category === 'Artist' && (
                  <i className="fa-solid fa-microphone" aria-hidden="true" />
                )}
                {category === 'Song' && (
                  <i className="fa-solid fa-music" aria-hidden="true" />
                )}
                {category === 'Genre' && (
                  <i className="fa-solid fa-icons" aria-hidden="true" />
                )}
              </span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MusicCategoryDropdown
