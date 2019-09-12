import { IncomeType } from "./IncomeType";

export interface Income {
    id: number, 
    userId: number,
    incomeType: IncomeType
    description: string,
    amount: number
}