import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return ''
  
  let date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    const parts = dateString.split(/[-/]/)
    if (parts.length === 3) {
      const p1 = parseInt(parts[0], 10)
      const p2 = parseInt(parts[1], 10)
      const p3 = parseInt(parts[2], 10)
      
      if (!isNaN(p1) && !isNaN(p2) && !isNaN(p3)) {
        let year, month, day
        if (p1 > 31) {
          year = p1 < 100 ? 2000 + p1 : p1
          month = p2 - 1
          day = p3
        } else if (p3 > 31) {
          year = p3 < 100 ? 2000 + p3 : p3
          month = p2 - 1
          day = p1
        } else {
          year = p3 < 100 ? 2000 + p3 : p3
          month = p2 - 1
          day = p1
        }
        date = new Date(year, month, day)
      }
    }
  }

  if (isNaN(date.getTime())) {
    return dateString
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return date.toLocaleDateString('en-US', options || defaultOptions)
}
