'use client'
import {
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  ChevronUp,
  Ellipsis,
  GripVertical
} from 'lucide-react'
import { type FC, type ReactNode, useEffect, useRef, useState } from 'react'

import { StrictModeDroppable } from '@/module/shared/components/StrictModeDroppable'
import {
  DragDropContext,
  Draggable,
  type DroppableProvided,
  type DropResult
} from '@hello-pangea/dnd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CardContent } from '../CardContent/CardContent'
import { Input } from '../Form/Input/Input'
import { Select } from '../Form/Input/Select'
import { PopupTableMenuAction } from './PopupTableMenuAction'

export type ActionOption = 'edit' | 'delete'
export type Priority = 'high' | 'medium' | 'low'
export type SortDirection = 'asc' | 'desc' | null

export interface TableColumn {
  key: string
  label: ReactNode | string
  width?: string
  render?: (value: any, row?: any) => ReactNode | string
  priority?: Priority
  sortable?: boolean
  searchable?: boolean
  imageField?: boolean
}

export interface TableActions {
  edit?: boolean
  delete?: boolean
}

export interface DynamicTableProps {
  columns: TableColumn[]
  data: Array<Record<string, any>>
  actions?: TableActions
  onReorder?: (reorderedItems: Array<Record<string, any>>) => void
  containerClassName?: string
  tableClassName?: string
  rowClassName?: string
  cellClassName?: string
  headerClassName?: string
  rowMobileClassName?: string
  enableSearch?: boolean
  enablePagination?: boolean
  enableSort?: boolean
  enableReorder?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  renderActions?: (id: string) => React.ReactNode
}

export const DynamicTable: FC<DynamicTableProps> = ({
  columns,
  data,
  actions = { edit: true, delete: true },
  onReorder,
  containerClassName = '',
  tableClassName = '',
  rowClassName = '',
  cellClassName = '',
  headerClassName = '',
  rowMobileClassName = '',
  enableSearch = true,
  enablePagination = true,
  enableSort = true,
  enableReorder = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  renderActions: renderActionsProps
}) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: SortDirection
  }>({ key: '', direction: null })
  const [filteredData, setFilteredData] = useState(data)
  const [term, setTerm] = useState<string>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRefSearch = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const q = params.get('q')
    if (q) {
      setTerm(q)
      setTimeout(() => {
        if (inputRefSearch.current) {
          inputRefSearch.current.focus()
          inputRefSearch.current.selectionStart = q.length
          inputRefSearch.current.selectionEnd = q.length
        }
      }, 500)
    }
  }, [])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  // Ordenamiento
  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc'

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc'
      else if (sortConfig.direction === 'desc') direction = null
      else direction = 'asc'
    }

    setSortConfig({ key, direction })

    const sorted = [...filteredData].sort((a, b) => {
      if (direction === null) return 0
      if (!a[key] || !b[key]) return 0

      const aValue = a[key].toString().toLowerCase()
      const bValue = b[key].toString().toLowerCase()

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredData(sorted)
  }

  // Reordenamiento
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    // Usar filteredData en lugar de items para mantener consistencia con búsqueda y filtros
    const updatedData = Array.from(filteredData)
    const [movedItem] = updatedData.splice(sourceIndex, 1)
    updatedData.splice(destinationIndex, 0, movedItem)

    setFilteredData(updatedData)
    onReorder?.(updatedData)
  }

  // Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const renderCell = (item: Record<string, any>, column: TableColumn) => {
    if (column.render) {
      return column.render(item[column.key], item)
    }
    return (
      <span
        className={`${
          column.imageField
            ? ''
            : 'block max-w-[300px] overflow-hidden overflow-ellipsis text-nowrap'
        }`}
      >
        {item[column.key]}
      </span>
    )
  }

  const highPriorityColumns = columns.filter(
    (col) => col.priority === 'high' || !col.priority
  )
  const otherColumns = columns.filter(
    (col) => col.priority !== 'high' && col.priority
  )

  return (
    <div className={`w-full ${containerClassName} mt-8`}>
      {/* Búsqueda y controles */}
      {enableSearch && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="w-full sm:w-48">
            <form>
              <Input
                ref={inputRefSearch}
                placeholder="Buscar..."
                name="q"
                className="bg-white"
                type="search"
                defaultValue={term}
                onChange={(e) => { setTerm(e.target.value) }}
              />
            </form>
          </div>
        </div>
      )}

      <PopupTableMenuAction />

      <CardContent
        className={'!my-3 !overflow-x-hidden !overflow-y-visible !p-2'}
      >
        {/* Vista Desktop */}
        <div className="over hidden lg:block">
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="table">
              {(provided: DroppableProvided) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`w-full ${tableClassName}`}
                >
                  <thead className="">
                    <tr className=" ">
                      {enableReorder && <th className="w-8" />}
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className={`px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 ${
                            column.width || 'flex-1'
                          } ${headerClassName}`}
                        >
                          <div className="flex items-center gap-2 py-1">
                            {column.label}
                            {enableSort && column.sortable && (
                              <button
                                className="h-8 w-8 p-0"
                                onClick={() => { handleSort(column.key) }}
                              >
                                <ChevronUp
                                  className={`h-4 w-4 ${
                                    sortConfig.key === column.key
                                      ? sortConfig.direction === 'asc'
                                        ? 'text-blue-600'
                                        : sortConfig.direction === 'desc'
                                          ? 'rotate-180 text-blue-600'
                                          : ''
                                      : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      {(actions.edit || actions.delete) && (
                        <th className="p-4 pt-0 text-left font-medium text-gray-600" />
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                        isDragDisabled={!enableReorder}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border-t ${
                              snapshot.isDragging
                                ? 'bg-blue-50 *:opacity-0'
                                : 'opacity-100'
                            } ${rowClassName}`}
                          >
                            {enableReorder && (
                              <td
                                className="w-8 px-3"
                                {...provided.dragHandleProps}
                              >
                                <GripVertical className="h-4 w-4 cursor-move text-gray-400" />
                              </td>
                            )}
                            {columns.map((column) => (
                              <td
                                key={`${item.id}-${column.key}`}
                                className={`text-slate-250 px-3 py-4 text-sm font-light ${
                                  column.width || 'flex-1'
                                } ${cellClassName}`}
                              >
                                {renderCell(item, column)}
                              </td>
                            ))}
                            <td className="relative flex justify-center p-2 px-3 py-4">
                              <button
                                onClick={(e) => {
                                  document.dispatchEvent(
                                    new CustomEvent('sendPopupEvent', {
                                      detail: {
                                        item,
                                        target: e.currentTarget,
                                        render: renderActionsProps
                                      }
                                    })
                                  )
                                }}
                                className="flex cursor-pointer items-center justify-center rounded px-2 py-2 hover:bg-gray-100"
                              >
                                <Ellipsis size={18} strokeWidth={1} />
                              </button>
                            </td>
                            {/* {renderActionsProps && (
                              <td className="p-2  px-3 py-4">
                                {renderActionsProps(item.id)}
                              </td>
                            )} */}
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </div>

        {/* Vista Mobile y Tablet */}
        <div className="lg:hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="mobile-table">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {paginatedData.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                      isDragDisabled={!enableReorder}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`rounded-lg border bg-white ${
                            snapshot.isDragging
                              ? 'border-blue-500 shadow-lg'
                              : ''
                          } ${rowClassName}`}
                        >
                          {/* Fila principal con columnas de alta prioridad */}
                          <div className="flex items-center p-4">
                            {enableReorder && (
                              <div
                                {...provided.dragHandleProps}
                                className="mr-3"
                              >
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div
                              className="flex-1"
                              onClick={() => { toggleRow(item.id) }}
                            >
                              <div className="space-y-2">
                                {highPriorityColumns.map((column) => (
                                  <div
                                    key={`${item.id}-${column.key}`}
                                    className="flex items-center"
                                  >
                                    <span className="mr-2 text-sm font-medium text-gray-600">
                                      {column.label}:
                                    </span>
                                    <span className="text-sm">
                                      {renderCell(item, column)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderActionsProps?.(item.id)}
                              <button
                                onClick={() => { toggleRow(item.id) }}
                                className="p-1"
                              >
                                <ChevronRightIcon
                                  size={20}
                                  className={`transition-transform ${
                                    expandedRows.includes(item.id)
                                      ? 'rotate-90'
                                      : ''
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Contenido expandible con columnas de menor prioridad */}
                          {expandedRows.includes(item.id) &&
                            otherColumns.length > 0 && (
                              <div className="border-t bg-gray-50 px-4 pb-4 pt-2">
                                <div className="space-y-2">
                                  {otherColumns.map((column) => (
                                    <div
                                      key={`${item.id}-${column.key}-expanded`}
                                      className={`flex items-center ${rowMobileClassName}`}
                                    >
                                      <span className="mr-2 text-sm font-medium text-gray-600">
                                        {column.label}:
                                      </span>
                                      <span className="text-sm">
                                        {renderCell(item, column)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>

          {/* Paginación móvil */}
          {enablePagination && filteredData.length > 0 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
              <select
                value={pageSize.toString()}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size.toString()}>
                    {size} por página
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => { setCurrentPage((prev) => prev - 1) }}
                  disabled={currentPage === 1}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      currentPage === 1 ? 'text-gray-400' : 'hover:underline'
                    }`}
                  >
                    <ChevronLeft size={20} />
                    Anterior
                  </div>
                </button>
                <span className="text-sm text-gray-600">
                  {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => { setCurrentPage((prev) => prev + 1) }}
                  disabled={currentPage === totalPages}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      currentPage === totalPages
                        ? 'text-gray-400'
                        : 'hover:underline'
                    } `}
                  >
                    Siguiente
                    <ChevronRight size={20} />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {/* Paginación */}
      {enablePagination && filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select
              name=""
              id=""
              value={pageSize.toString()}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-white"
            >
              {pageSizeOptions.map((size, key) => (
                <option key={key} value={size.toString()}>
                  {size}
                </option>
              ))}
            </Select>
            <div>por página</div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => { setCurrentPage((prev) => prev - 1) }}
              disabled={currentPage === 1}
            >
              <div
                className={`flex items-center gap-1 ${
                  currentPage === 1 ? 'text-gray-400' : 'hover:underline'
                }`}
              >
                <ChevronLeft size={16} />
              </div>
            </button>
            <div className="rounded border border-gray-200 bg-slate-100 p-2">
              {currentPage}
            </div>
            <button
              onClick={() => { setCurrentPage((prev) => prev + 1) }}
              disabled={currentPage === totalPages}
            >
              <div
                className={`flex items-center gap-1 ${
                  currentPage === totalPages
                    ? 'text-gray-400'
                    : 'hover:underline'
                } `}
              >
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No hay datos para mostrar
        </div>
      )}
    </div>
  )
}
