import { User } from "./User";
import { ExpenseType } from "./ExpenseType";

export interface Expense {
    id: number,
    userId: number,
    user: User,
    expenseType: ExpenseType,
    date: Date,
    description: string,
    amount: number
}