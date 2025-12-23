import { useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { useExpressionLibraryStore } from '../store'
import { BulkActions } from './bulk-actions'
import { columns } from './columns'
import { StatusFilters } from './status-filters'
import { UpdatedAtFilter } from './updated-at-filter'

const sortingToOrder = (sorting: SortingState) => {
  const fieldMap: Record<string, string> = {
    expression: 'expression',
    status: 'status',
    addedAt: 'added_at',
    updatedAt: 'updated_at',
  }

  const order = sorting
    .map((item) => {
      const field = fieldMap[item.id]
      if (!field) return null
      return `${field}:${item.desc ? 'desc' : 'asc'}`
    })
    .filter(Boolean)
    .join(',')

  return order
}

export function LibraryTable() {
  const data = useExpressionLibraryStore((state) => state.data)
  const pages = useExpressionLibraryStore((state) => state.pages)
  const page = useExpressionLibraryStore((state) => state.page)
  const pageSize = useExpressionLibraryStore((state) => state.pageSize)
  const loading = useExpressionLibraryStore((state) => state.loading)
  const error = useExpressionLibraryStore((state) => state.error)
  const setPage = useExpressionLibraryStore((state) => state.setPage)
  const setPageSize = useExpressionLibraryStore((state) => state.setPageSize)
  const setOrder = useExpressionLibraryStore((state) => state.setOrder)

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const paginationState = useMemo(
    () => ({
      pageIndex: Math.max(0, page - 1),
      pageSize,
    }),
    [page, pageSize]
  )

  const handleSortingChange = (next: SortingState) => {
    setSorting(next)
    setOrder(sortingToOrder(next))
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      pagination: paginationState,
      rowSelection,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: pages?.last ?? 0,
    enableRowSelection: true,
    onPaginationChange: (next) => {
      const nextState =
        typeof next === 'function' ? next(paginationState) : next
      if (nextState.pageSize !== pageSize) {
        setPageSize(nextState.pageSize)
        return
      }
      setPage(nextState.pageIndex + 1)
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: (next) => {
      const nextState = typeof next === 'function' ? next(sorting) : next
      handleSortingChange(nextState)
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const columnCount = table.getAllLeafColumns().length

  return (
    <div className='space-y-2'>
      {error && (
        <Alert variant='destructive'>
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        <div className='flex flex-wrap items-center gap-3'>
          <UpdatedAtFilter />
          <Separator orientation='vertical' className='h-6' />
          <StatusFilters />
        </div>
        <div className='flex gap-2'>
          <span>
            {pages
              ? `共 ${pages.total.toLocaleString()} 条记录`
              : '正在统计...'}
          </span>
        </div>
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={Math.max(columnCount, 1)}>
                  <div className='py-8 text-center text-sm text-muted-foreground'>
                    正在加载表达库...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Math.max(columnCount, 1)}>
                  <div className='py-8 text-center text-sm text-muted-foreground'>
                    未找到符合条件的条目，请调整筛选或刷新。
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <BulkActions table={table} />
    </div>
  )
}
