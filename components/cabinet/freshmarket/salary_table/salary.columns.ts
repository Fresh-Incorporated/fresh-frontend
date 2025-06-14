import { h } from 'vue'
import type {ColumnDef} from "@tanstack/vue-table";
import {ShCheckbox} from "#components";

export const columns: ColumnDef[] = [
    {
        accessorKey: 'uuid',
        header: 'Аватар',
        cell: ({ row }) => h('img', { src: `https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${row.getValue('uuid')}/full`, class: 'w-12 h-12' }, row),
    },
    {
        accessorKey: 'nickname',
        header: 'Никнейм',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('nickname')),
    },
]