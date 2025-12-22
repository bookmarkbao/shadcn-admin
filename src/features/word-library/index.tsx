import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { HeaderFlex } from '@/components/layout/headerFlex'
import { Main } from '@/components/layout/main'
import { WordLibraryDialogs } from './components/word-library-dialogs'
import { WordLibraryFetchEffect } from './components/word-library-fetch-effect'
import { WordLibraryHeader } from './components/word-library-header'
import { WordLibraryProvider } from './components/word-library-provider'
import { WordLibraryTable } from './components/word-library-table'
import { useWordLibraryStore } from './store'

export function WordLibrary() {
  // 控制伸缩布局
  const isFluid = useWordLibraryStore((state) => state.isFluid)
  return (
    <WordLibraryProvider>
      <AuthenticatedLayout>
        <HeaderFlex fixed fluid={isFluid}>
          <WordLibraryHeader />
        </HeaderFlex>
        <Main fluid={isFluid} className='pt-2'>
          <WordLibraryTable />
        </Main>
        <WordLibraryFetchEffect />
        <WordLibraryDialogs />
      </AuthenticatedLayout>
    </WordLibraryProvider>
  )
}
