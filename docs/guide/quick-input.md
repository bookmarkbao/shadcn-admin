# 快输入词库

在快速编写新页面时直接复制常用结构、组件引用、说明语句和按钮文案。以下片段常用于此项目的功能页，有助于保持一致性。

## 页面骨架

```tsx
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function FeaturePage() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {/* 填充页面内容 */}
      </Main>
    </>
  )
}
```

## 通用章节

- **标题 + 副标题**
  ```tsx
  <div>
    <h2 className='text-2xl font-bold tracking-tight'>页面标题</h2>
    <p className='text-muted-foreground'>简短说明本页用途或关键指标。</p>
  </div>
  ```
- **卡片网格**
  ```tsx
  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
    <Card>…</Card>
  </div>
  ```
- **Tabs 结构**
  ```tsx
  <Tabs defaultValue='overview' className='space-y-4'>
    <TabsList>
      <TabsTrigger value='overview'>Overview</TabsTrigger>
      <TabsTrigger value='details'>Details</TabsTrigger>
    </TabsList>
    <TabsContent value='overview'>概览内容</TabsContent>
  </Tabs>
  ```
- **提示/警告**
  ```tsx
  <Alert>
    <AlertTitle>注意</AlertTitle>
    <AlertDescription>在 `.env` 中设置 `VITE_CLERK_PUBLISHABLE_KEY` 以启用 Clerk。</AlertDescription>
  </Alert>
  ```

## 常用组件短语

- “快速操作 / Quick Actions”
- “支持浅色/深色模式切换”
- “数据将按照最新 Sync 更新”
- “操作需要拥有对应权限，详见管理员设置”
- “生成截图或录像覆盖 light + dark + RTL 场景”

## 生成流程

1. 复制骨架到新 feature，修改导入的 feature 组件。
2. 用卡片、表格、数据块填充 `Main`，嵌入 `Tabs` 或 `Dialog`。
3. 补充文案（标题、描述、提示）并保持 Tailwind 类顺序。
4. 若涉及权限/Clerk，在 `.env` 中配置 `VITE_CLERK_PUBLISHABLE_KEY` 并提示用户。
