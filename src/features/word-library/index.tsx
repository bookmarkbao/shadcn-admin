import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { WordLibraryDialogs } from './components/word-library-dialogs'
import { WordLibraryHeader } from './components/word-library-header'
import { WordLibraryProvider } from './components/word-library-provider'
import { WordLibraryTable } from './components/word-library-table'

export function WordLibrary() {
  return (
    <WordLibraryProvider>
      <AuthenticatedLayout>
        <Header fixed>
          <WordLibraryHeader />
        </Header>
        <Main fluid className='pt-2'>
            <WordLibraryTable />
        </Main>
        <WordLibraryDialogs />
      </AuthenticatedLayout>
    </WordLibraryProvider>
  )
}
