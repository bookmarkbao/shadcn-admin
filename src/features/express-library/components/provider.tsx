import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type UExpression } from '../data/types'

type DialogType = 'edit' | 'delete'

type LibraryContextType = {
  open: DialogType | null
  setOpen: (value: DialogType | null) => void
  currentRow: UExpression | null
  setCurrentRow: React.Dispatch<React.SetStateAction<UExpression | null>>
}

const LibraryContext = React.createContext<LibraryContextType | null>(null)

export function Provider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<UExpression | null>(null)

  return (
    <LibraryContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LibraryContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLibrary = () => {
  const ctx = React.useContext(LibraryContext)
  if (!ctx) {
    throw new Error('useLibrary has to be used within <Provider>')
  }
  return ctx
}
