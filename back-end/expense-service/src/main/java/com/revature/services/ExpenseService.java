package com.revature.services;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
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

//	Function used to calculate both previous and next months dates in order to search
//	expenses for the current month
	public Date calculateDate(LocalDate date) {
		int year = date.getYear();
		int month = date.getMonthValue();
		int day = date.getDayOfMonth();
		Calendar cal = Calendar.getInstance();
		cal.set(year, month - 1, day);
		Date calcDate = cal.getTime();
		return calcDate;
	}

//	Function used to get monthly expenses; it means, after the start of current month and before
//	the start of next month
	public List<Expense> findMonthlyExpensesByUserId(int userId) {
//		Define the Date object according to the date parameter

//		Define previous month date
		Date currMonthStart = calculateDate(LocalDate.now().withDayOfMonth(1));
//		Define next month date
		Date nextMonthStart = calculateDate(LocalDate.now().plusMonths(1).withDayOfMonth(1));
		return expenseRepository.findByUserIdAndDateBetween(userId, currMonthStart, nextMonthStart);
	}

	@SuppressWarnings("deprecation")
	public List<TotalExpense> findTotalMonthlyExpensesForYearByUserId(int userId) {
		List<TotalExpense> totals = new ArrayList<TotalExpense>();
//		Define previous year date
		Date today = calculateDate(LocalDate.now());
//		Define next month date
		Date aYearAgoToday = calculateDate(LocalDate.now().minusYears(1));

		List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, aYearAgoToday, today);

		for (int i = 1; i < 13; i++) {
			int monthInt = LocalDate.now().minusYears(1).plusMonths(i).getMonthValue();
			String monthString = LocalDate.now().minusYears(1).plusMonths(i).getMonth().getDisplayName(TextStyle.FULL,
					Locale.ENGLISH);
			int year = LocalDate.now().minusYears(1).plusMonths(i).getYear();
//			System.out.println(year);
			double sum = 0;
			double thisMonthSum = 0;
			for (Expense k : expenses) {

				if (monthInt == k.getDate().getMonth() + 1)
					sum += k.getAmount();

			} // Inner enhanced for loop

			// Check if there was logged expenses for the month
			if (sum > 0) {
				TotalExpense month = new TotalExpense(monthString, sum);
				totals.add(month);
			}

		} // Outer Monthly For loop

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
