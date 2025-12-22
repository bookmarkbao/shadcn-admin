import { createFileRoute } from '@tanstack/react-router'
import { WordLibrary } from '@/features/word-library'

export const Route = createFileRoute('/(vocabulary)/word-library/')({
  component: WordLibrary,
})
