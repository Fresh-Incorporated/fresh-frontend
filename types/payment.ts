export interface Payment {
    id: string
    value: number
    message: string | undefined
    action_type: "deposit" | "freshmarket_shop_withdraw" | "withdraw" | "freshmarket_order" | "freshmarket_pay" | "freshmarket_salary"
    createdAt: Date
}