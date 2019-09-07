package com.revature.services;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.models.TotalExpense;
import com.revature.repositories.ExpenseRepository;
import com.revature.repositories.ExpenseTypeRepository;

@Service
public class ExpenseService {
	ExpenseRepository<Expense> expenseRepository;
	ExpenseTypeRepository<ExpenseType> expenseTypeRepository;

	@Autowired
	public ExpenseService(ExpenseRepository<Expense> expenseRepository,
			ExpenseTypeRepository<ExpenseType> expenseTypeRepository) {
		super();
		this.expenseRepository = expenseRepository;
		this.expenseTypeRepository = expenseTypeRepository;
	}

	public List<Expense> findExpenseByUserIdAndExpenseType(int userId, Optional<ExpenseType> expenseType) {
		return expenseRepository.findByUserIdAndExpenseType(userId, expenseType);
	}

	// Get expense by ID
	public Optional<Expense> getById(int id) {
		return expenseRepository.findById(id);
	}

	// Get expense by USER
	public List<Expense> findByUserId(int userId) {
		return expenseRepository.findByUserIdOrderByIdDesc(userId);
	}

	// Get expense by TYPE
	public Optional<ExpenseType> findExpenseTypeById(int id) {
		return expenseTypeRepository.findById(id);
	}

	// Get all expense types
	public List<ExpenseType> findAllExpenseTypes() {
		return expenseTypeRepository.findAll();
	}

//	Function used to get monthly expenses; it means, after the start of current month and before
//	the start of next month
	public List<Expense> findMonthlyExpensesByUserId(int userId) {
//		Define the Date object according to the date parameter

//		Define previous month date
		LocalDate currMonthStart = LocalDate.now().withDayOfMonth(1);
//		Define next month date
		LocalDate nextMonthStart = LocalDate.now().plusMonths(1).withDayOfMonth(1);
		return expenseRepository.findByUserIdAndDateBetween(userId, currMonthStart, nextMonthStart);
	}

	public List<TotalExpense> findTotalMonthlyExpensesForYearByUserId(int userId) {
		List<TotalExpense> totals = new ArrayList<TotalExpense>();
//		Define previous year date
		LocalDate today = LocalDate.now();
//		Define next month date
		LocalDate aYearAgoToday = LocalDate.now().minusYears(1);
//		Search last year expenses
		List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, aYearAgoToday, today);
//		Create a Map to store total per month
		Map<String,Double> totalsMap = new HashMap<String,Double>();
//		Add all months and initialize amount to 0
		for (int i = 1; i < 13; i++) {
			totalsMap.put(LocalDate.now().withMonth(i).getMonth()
							.getDisplayName(TextStyle.FULL, Locale.ENGLISH),0.0);
		}
//		Iterate over the found expenses during the year
		for (Expense e:expenses) {
//			Check if the amount is greater than 0.0
			if (e.getAmount() > 0.0) {
//				Get the month as string
				String monthString = e.getDate().getMonth()
							.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
//				Add the amount to the map for the corresponding month
				double prevAmount = totalsMap.get(monthString);
				double newAmount = prevAmount + e.getAmount();
				totalsMap.put(monthString, newAmount);
			}
		}
//		Finally, iterate over the totalMap entry set and return the list of total expenses
		for (Map.Entry<String, Double> total : totalsMap.entrySet()) {
			if (total.getValue() > 0.0) {
//				Total expense
				TotalExpense totalForMonth = new TotalExpense(total.getKey(), total.getValue());
				totals.add(totalForMonth);
			}
		}
		return totals;
	}

	public void deleteExpense(int id) {
		expenseRepository.deleteById(id);
	}

	public boolean addExpense(Expense expense) {
		return expenseRepository.save(expense) != null;
	}

	public boolean updateExpense(Expense expense) {
		return expenseRepository.save(expense) != null;
	}

	public void deleteByUserId(int userId) {
		List<Expense> toBeGone = expenseRepository.findByUserId(userId);
		for (Expense b : toBeGone) {
			expenseRepository.deleteById(b.getId());
		}
		return;
	}

}
