import { WordLibraryDeleteDialog } from './word-library-delete-dialog'
import { WordLibraryEditDialog } from './word-library-edit-dialog'
import { useWordLibrary } from './word-library-provider'

export function WordLibraryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWordLibrary()

  if (!currentRow) return null

  return (
    <>
      <WordLibraryEditDialog
        key={`word-edit-${currentRow.word}`}
        open={open === 'edit'}
        onOpenChange={(next) => {
          setOpen('edit')
          if (!next) {
            setTimeout(() => setCurrentRow(null), 300)
          }
        }}
        currentRow={currentRow}
      />

      <WordLibraryDeleteDialog
        key={`word-delete-${currentRow.word}`}
        open={open === 'delete'}
        onOpenChange={(next) => {
          setOpen('delete')
          if (!next) {
            setTimeout(() => setCurrentRow(null), 300)
          }
        }}
        currentRow={currentRow}
      />
    </>
  )
}

