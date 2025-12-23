import { createFileRoute } from '@tanstack/react-router'
import { ExpressionLibrary } from '@/features/express-library'

export const Route = createFileRoute('/express-library/')({
  component: ExpressionLibrary ,
})
