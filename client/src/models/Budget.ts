import { BudgetType } from "./BudgetType";

export interface Budget {
    id: number,
    userId: number,
    amount: number,
    budgetType:BudgetType
}