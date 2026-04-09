import { ReactNode } from 'react'

/**
 * Wraps every "G" and "g" letter in a Bagoss Condensed span.
 * Used for headings/titles only.
 */
export function StylizedText({ children, className }: { children: string; className?: string }) {
  const parts: ReactNode[] = []
  for (let i = 0; i < children.length; i++) {
    const ch = children[i]
    if (ch === 'G' || ch === 'g') {
      parts.push(
        <span key={i} className="bagoss-g">
          {ch}
        </span>
      )
    } else {
      // Batch consecutive non-G chars
      let j = i + 1
      while (j < children.length && children[j] !== 'G' && children[j] !== 'g') j++
      parts.push(children.slice(i, j))
      i = j - 1
    }
  }
  return <span className={className}>{parts}</span>
}
