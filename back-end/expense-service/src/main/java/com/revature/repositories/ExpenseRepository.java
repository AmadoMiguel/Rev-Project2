package com.revature.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;

public interface ExpenseRepository<P> extends JpaRepository<Expense, Integer> {

	List<Expense> findByUserId(int userId);

	List<Expense> findByUserIdAndExpenseType(int userId, Optional<ExpenseType> expenseType);

	List<Expense> findByUserIdOrderByIdDesc(int userId);

	List<Expense> findByUserIdAndDateBetween(int userId, Date prevMonthDate, Date nextMonthDate);

}