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
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(ShCheckbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('status')),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return h(ShButton, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
    },
    {
        accessorKey: 'amount',
        header: () => h('div', { class: 'text-right' }, 'Amount'),
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('amount'))

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)

            return h('div', { class: 'text-right font-medium' }, formatted)
        },
    },
]