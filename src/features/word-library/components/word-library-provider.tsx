import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type UWord } from '../data/types'

type WordLibraryDialogType = 'edit' | 'delete'

type WordLibraryContextType = {
  open: WordLibraryDialogType | null
  setOpen: (value: WordLibraryDialogType | null) => void
  currentRow: UWord | null
  setCurrentRow: React.Dispatch<React.SetStateAction<UWord | null>>
}

const WordLibraryContext = React.createContext<WordLibraryContextType | null>(
  null
)

export function WordLibraryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<WordLibraryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<UWord | null>(null)

  return (
    <WordLibraryContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </WordLibraryContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWordLibrary = () => {
  const ctx = React.useContext(WordLibraryContext)
  if (!ctx) {
    throw new Error('useWordLibrary has to be used within <WordLibraryProvider>')
  }
  return ctx
}

