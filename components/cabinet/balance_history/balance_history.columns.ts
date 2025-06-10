import { h } from 'vue'
import type {ColumnDef} from "@tanstack/vue-table";
import type {Payment} from "~/types/payment";
import {ShButton, ShCheckbox} from "#components";
import {ArrowUpDown} from "lucide-vue-next";

export const columns: ColumnDef<Payment>[] = [
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
        accessorKey: 'createdAt',
        header: 'Дата',
        cell: ({ row }) => h('div', { class: '' }, formatDateRelative(row.getValue('createdAt'))),
    },
    {
        accessorKey: 'action_type',
        header: 'Тип операции',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('action_type')),
    },
    {
        accessorKey: 'message',
        header: 'Сообщение',
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('message')),
    },
    {
        accessorKey: 'value',
        header: 'Сумма',
        cell: ({ row }) => h('div', { class: row.getValue('value') as number > 0 ? 'text-green-500' : 'text-red-500' }, row.getValue('value') + " АР"),
    },
]