export interface Product {
    id: number
    name: string
    description: string
    icon: string
    price: number
    count: number
    verify_status: number
    refill_status: number
    refillCell?: {
        letter: string
        number: string
    }
}

export interface Shop {
    id: number
    name: string
    products: Product[]
}

export interface ProductHistoryEntry {
    date: string
    event: string
    [key: string]: any
}
