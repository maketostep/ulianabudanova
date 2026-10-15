export type Service = {
  number: string
  title: string
  description: string
  accent?: boolean
}

export type ProjectCategory = 'События' | 'Бренды' | 'Рестораны' | 'Частные'

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  label: string
  palette: readonly [string, string, string]
  metric?: string
  /** Number of photos in public/projects/{id}/, named 01.jpg, 02.jpg, ... */
  photoCount: number
  cover: number
  alt: string
}
