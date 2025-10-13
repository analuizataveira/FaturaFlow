import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import { CellComponent } from '../components/cell-component'
import { HeaderComponent } from '../components/header-component'

type SpecialCellType<T> = {
  accessorKey: string
  content: (row: Row<T>, accessorKey: string) => React.JSX.Element | void
}

type IColumnsProps<T> = {
  titles: string[]
  example?: T
  actionCell?: ({ row }: CellContext<T, unknown>) => React.JSX.Element | void
  specialCells?: SpecialCellType<T>[]
}

export function generateColumns<T>({
  titles,
  example,
  actionCell,
  specialCells,
}: IColumnsProps<T>): ColumnDef<T>[] {
  const array: ColumnDef<T>[] = []

  function defineCellContent(accessorKey: string) {
    if (specialCells) {
      const specialCell = specialCells.find(
        cell => cell.accessorKey === accessorKey,
      )
      if (specialCell) {
        return ({ row }: CellContext<T, unknown>) =>
          specialCell.content(row, accessorKey)
      }
    }

    return ({ row }: CellContext<T, unknown>) => (
      <CellComponent value={row.getValue(accessorKey.toString())} />
    )
  }

  if (example) {
    const JSONdata = JSON.stringify(example)
    const accessorKeys = Object.keys(JSON.parse(JSONdata))

    accessorKeys.map((accessorKey, index) => {
      if (titles[index] !== undefined) {
        array.push({
          accessorKey: accessorKey,
          header: ({ column }) => (
            <HeaderComponent title={titles[index] ?? ''} column={column} />
          ),
          cell: defineCellContent(accessorKey),
        })
      }
    })
  } else {
    titles.map(title => {
      array.push({
        accessorKey: title,
        header: ({ column }) => (
          <HeaderComponent title={title} column={column} />
        ),
        cell: ({ row }) => <CellComponent value={row.getValue(title)} />,
      })
    })
  }

  if (actionCell) {
    array.push({
      accessorKey: 'actions',
      header: ({ column }) => (
        <HeaderComponent title='Ações' column={column} className='w-20' />
      ),
      cell: actionCell,
    })
  }

  return array
}
