import { FoldHorizontal, UnfoldHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useExpressionLibraryStore } from '../store'
export const FluidButton = () => {
  const toggleFluid = useExpressionLibraryStore((state) => state.toggleFluid)
  const isFluid = useExpressionLibraryStore((state) => state.isFluid)
  return (
    <>
      <Button variant={'ghost'} size='sm' onClick={toggleFluid}>
        {isFluid ? (
          <FoldHorizontal className='h-4 w-4' />
        ) : (
          <UnfoldHorizontal className='h-4 w-4' />
        )}
      </Button>
    </>
  )
}
