import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Main } from '@/components/layout/main'

export function WordLibrary() {
  return (
    <AuthenticatedLayout>
      <Main fluid>
          <h1 className='text-3xl font-bold tracking-tight'>我的词库</h1>
      </Main>
    </AuthenticatedLayout>
  )
}
