import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { WordLibraryHeader } from './components/word-library-header'
import { WordLibraryTable } from './components/word-library-table'

export function WordLibrary() {
  return (
    <AuthenticatedLayout>
      <Header fixed>
        <WordLibraryHeader />
      </Header>

      <Main fluid>
        <section className='space-y-5 p-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>我的词库</h1>
          </div>
          <WordLibraryTable />
        </section>
      </Main>
    </AuthenticatedLayout>
  )
}
