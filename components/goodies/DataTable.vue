<script setup lang="ts" generic="TData, TValue">
import {type ColumnDef, getPaginationRowModel} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const emit = defineEmits<{
  (e: 'loadMore', fullLoaded: () => void, callback: (...args: any[]) => void, args: any[]): void
}>()

const dataModel = defineModel<TData[]>('data', { required: true })
const paginationPage = ref(1)

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  pagination: boolean
}>()

const table = useVueTable({
  get data() {
    return dataModel.value
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  ...(props.pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
})

const setPage = async (page: number) => {
  if (table.getPageCount() >= page) {
    table.setPageIndex(page)
  } else {
    table.setPageIndex(page)
  }
  paginationPage.value = table.getState().pagination.pageIndex + 1
}

const fullLoaded = ref(false)

const _fullLoaded = () => {
  fullLoaded.value = true
}

const loadMore = (page: number) => {
  emit('loadMore', _fullLoaded, setPage, [page])
}

const nextPage = () => {
  if (table.getCanNextPage()) {
    table.nextPage()
  } else {
    loadMore(table.getState().pagination.pageIndex + 1)
  }
}

watch(paginationPage, (newValue: number) => {
  if (newValue == table.getPageCount()) {
    loadMore(table.getState().pagination.pageIndex)
  }
})
</script>

<template>
  <div>
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                  v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
                v-for="row in table.getRowModel().rows" :key="row.id"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div v-if="pagination" class="flex items-center justify-end py-4 space-x-2">
      <ShPagination
          v-slot="{ page }"
          v-model:page="paginationPage"
          :items-per-page="table.getState().pagination.pageSize"
          :total="dataModel.length"
          :default-page="table.getState().pagination.pageIndex + 1"
      >
        <ShPaginationContent v-slot="{ items }">
          <ShPaginationPrevious :disabled="!table.getCanPreviousPage()"
                                @click="table.previousPage()" />

          <template v-for="(item, index) in items" :key="index">
            <ShPaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
                @click="table.setPageIndex(index)"
            >
              {{ item.value }}
            </ShPaginationItem>
          </template>

          <ShPaginationEllipsis v-if="!fullLoaded" @click="loadMore(table.getState().pagination.pageIndex)" :index="4" />

          <ShPaginationNext :disabled="fullLoaded && !table.getCanNextPage()" @click="nextPage()" />
        </ShPaginationContent>
      </ShPagination>
    </div>
  </div>
</template>