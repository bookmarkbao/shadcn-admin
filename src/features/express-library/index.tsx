import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { HeaderFlex } from '@/components/layout/headerFlex'
import { Main } from '@/components/layout/main'
import { Dialogs } from './components/dialogs'
import { FetchEffect } from './components/fetch-effect'
import { Header } from './components/header'
import { Provider } from './components/provider'
import { LibraryTable } from './components/table'
import { useExpressionLibraryStore } from './store'

export function ExpressionLibrary() {
  const isFluid = useExpressionLibraryStore((state) => state.isFluid)

  return (
    <Provider>
      <AuthenticatedLayout>
        <HeaderFlex fixed fluid={isFluid}>
          <Header />
        </HeaderFlex>
        <Main fluid={isFluid} className='pt-2'>
          <LibraryTable />
        </Main>
        <FetchEffect />
        <Dialogs />
      </AuthenticatedLayout>
    </Provider>
  )
}
