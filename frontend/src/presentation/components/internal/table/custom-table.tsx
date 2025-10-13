/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { InputHTMLAttributes, Key, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { Pagination } from '../pagination/pagination'
import { cn } from '@/utils/cn'

interface PaginateMeta {
  total: number
  lastPage: number
  currentPage: number
  take: number
}

export type CustomTableProps<T> = InputHTMLAttributes<HTMLDivElement> & {
  data: T[]
  columns: ColumnDef<T>[]
  paginateMeta?: PaginateMeta
  isPaginated?: boolean
  hasActions?: boolean
  onPageChange?: (page: number) => void
}

export function CustomTable<T>({
  data,
  columns,
  paginateMeta,
  isPaginated = true,
  hasActions = false,
  onPageChange,
  ...props
}: CustomTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable<T>({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function genTableInfo() {
    let firstIndex = 0
    let lastIndex = 0
    if (paginateMeta) {
      firstIndex = 1 + (paginateMeta.currentPage - 1) * paginateMeta.take
      if (paginateMeta.currentPage < paginateMeta.lastPage) {
        lastIndex = paginateMeta.currentPage * paginateMeta.take
      } else {
        lastIndex = paginateMeta.total
      }
    }
    return `${firstIndex} - ${lastIndex}`
  }

  return (
    <div
      {...props}
      className='flex w-full flex-col justify-between rounded bg-white drop-shadow'
    >
      <Table className='rounded border-b border-b-border'>
        <TableHeader className='h-12 bg-gradient-to-b from-primary to-primary-600'>
          {table
            .getHeaderGroups()
            .map(
              (headerGroup: { id: Key | null | undefined; headers: any[] }) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (
                      header: {
                        id: Key | null | undefined
                        isPlaceholder: any
                        column: { columnDef: { header: any } }
                        getContext: () => any
                      },
                      index: number,
                    ) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            'h-12',
                            index === 0 && 'rounded-tl',
                            index === headerGroup.headers.length - 1 &&
                              'rounded-tr',
                            index === headerGroup.headers.length - 1 &&
                              hasActions &&
                              'w-20',
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    },
                  )}
                </TableRow>
              ),
            )}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(
              (
                row: {
                  id: Key | null | undefined
                  getIsSelected: () => any
                  getVisibleCells: () => any[]
                },
                index: number,
              ) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'h-12 border-b border-b-border transition-colors hover:bg-input',
                    index % 2 === 0 && 'bg-row-table',
                    index % 2 !== 0 && 'bg-white',
                  )}
                >
                  {row
                    .getVisibleCells()
                    .map(
                      (cell: {
                        id: Key | null | undefined
                        column: { columnDef: { cell: any } }
                        getContext: () => any
                      }) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ),
                    )}
                </TableRow>
              ),
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Não possui nenhum item
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isPaginated && (
        <div className='flex w-full flex-row items-center justify-between p-2'>
          <span className='ml-4 flex w-[200px] text-sm text-neutral-500'>
            {genTableInfo()}
          </span>
          <div className={`flex w-full justify-end`}>
            <Pagination
              currentPage={paginateMeta ? paginateMeta.currentPage : 1}
              totalPages={paginateMeta ? paginateMeta.lastPage : 1}
              onPageChange={onPageChange}
            ></Pagination>
          </div>
        </div>
      )}
    </div>
  )
}
