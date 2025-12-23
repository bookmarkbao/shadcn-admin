import { DeleteDialog } from './delete-dialog'
import { EditDialog } from './edit-dialog'
import { useLibrary } from './provider'

export function Dialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLibrary()

  if (!currentRow) return null

  return (
    <>
      <EditDialog
        key={`expression-edit-${currentRow.id}`}
        open={open === 'edit'}
        onOpenChange={(next) => {
          setOpen('edit')
          if (!next) {
            setTimeout(() => setCurrentRow(null), 300)
          }
        }}
        currentRow={currentRow}
      />

      <DeleteDialog
        key={`expression-delete-${currentRow.id}`}
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
