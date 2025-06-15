import { h } from 'vue'
import type {ColumnDef} from "@tanstack/vue-table";
import {ShCheckbox} from "#components";

export const columns: ColumnDef[] = [
    {
        id: 'select',
        header: ({ table }) => h(ShCheckbox, {
            'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Выбрать всё',
        }),
        cell: ({ row }) => h(ShCheckbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': value => row.toggleSelected(!!value),
            'ariaLabel': 'Выбрать',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'icon',
        header: 'Иконка',
        cell: ({ row }) => h('img', { src: row.getValue('icon'), class: 'w-12 h-12' }),
    },
    {
        accessorKey: 'name',
        header: 'Название',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
    },
    {
        accessorKey: 'description',
        header: 'Описание',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('description')),
    },
    {
        accessorKey: 'slots_count',
        header: 'Слотов для 1 ед. товара',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('slots_count')),
    },
    {
        accessorKey: 'stack_count',
        header: 'В каждом слоте',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('stack_count')),
    },
    {
        accessorKey: 'pos_count',
        header: 'Ед. в заказе',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('pos_count')),
    },
    {
        accessorKey: 'order_items',
        header: 'Предметов в заказе',
        cell: ({ row }) => h('div', { class: '' },
            row.getValue('pos_count') as number *
            row.getValue('slots_count') as number *
            row.getValue('stack_count') as number
        ),
    },
]