package com.revature.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.repositories.ExpenseRepository;
import com.revature.repositories.ExpenseTypeRepository;

// Unit testing for the ExpenseService methods using JUnit and Mockito
@RunWith(MockitoJUnitRunner.class)
public class ExpensesServicesTest {
	
	@InjectMocks
	private ExpenseService expenseServicesMock;
	
	@Mock
	private ExpenseRepository<Expense> expenseRepositoryMock;
	
	@Mock
	private ExpenseTypeRepository<ExpenseType> expenseTypeRepositoryMock;
	
	@Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);
    }
	
	@Test
	public void findExpensesByUserIdTest() {
//		Define a fake user id
		int fakeUserId = (int)Math.random()*100;
//		Create a fake list of expenses
		List<Expense> fakeExpenses = new ArrayList<Expense>();
//		Create and add some expenses to the list
		Expense fakeExp1 = new Expense(1, fakeUserId, null, LocalDate.now(), "Car bill", 150.45);
		Expense fakeExp2 = new Expense(2, fakeUserId, null, LocalDate.now(), "Food bill", 90.50);
		fakeExpenses.add(fakeExp1);
		fakeExpenses.add(fakeExp2);
//		Define expectations for the expense repository method
		when(expenseRepositoryMock.findByUserIdOrderByIdDesc(fakeUserId)).thenReturn(fakeExpenses);
//		Create assertion
		assertThat(expenseServicesMock.findByUserId(fakeUserId)).isEqualTo(fakeExpenses);
	}
	
	@Test
	public void findExpenseTypesTest() {
//		Create fake list of expenseTypes
		List<ExpenseType> fakeExpenseTypes = new ArrayList<ExpenseType>();
//		Add fake expense types objects and add to the list
		ExpenseType fakeBillsExpenseType = new ExpenseType(1, "Bills");
		ExpenseType fakeFoodExpenseType = new ExpenseType(2, "Food");
		ExpenseType fakeFunExpenseType = new ExpenseType(3, "Fun");
		fakeExpenseTypes.add(fakeBillsExpenseType);
		fakeExpenseTypes.add(fakeFoodExpenseType);
		fakeExpenseTypes.add(fakeFunExpenseType);
//		Define expectation for the expense type repository
		when(expenseTypeRepositoryMock.findAll()).thenReturn(fakeExpenseTypes);
//		Create assertion
		assertThat(expenseServicesMock.findAllExpenseTypes()).isEqualTo(fakeExpenseTypes);
	}
	
	@Test
	public void findThisMonthExpensesByUserIdTest() {
//		Define previous month date
		LocalDate currMonthStart = LocalDate.now().withDayOfMonth(1);
//		Define next month date
		LocalDate nextMonthStart = LocalDate.now().plusMonths(1).withDayOfMonth(1);
//		Create fake list of expenses
		List<Expense> fakeExpenses = new ArrayList<Expense>();
//		Create fake user id
		int fakeUserId = 5;
//		Create some fake expenses and add to the list
		Expense fakeExp1 = new Expense(1, fakeUserId, null, LocalDate.now(), 
									   "Disney entrance", 120);
		Expense fakeExp2 = new Expense(2, fakeUserId, null,LocalDate.now().withDayOfMonth(3), 
									   "Lunch", 40);
		fakeExpenses.add(fakeExp1);
		fakeExpenses.add(fakeExp2);
//		Define expectation for the expense repository
		when(expenseRepositoryMock
			.findByUserIdAndDateBetween(fakeUserId, currMonthStart, nextMonthStart))
					.thenReturn(fakeExpenses);
//		Create assertion
		assertThat(expenseServicesMock.findMonthlyExpensesByUserId(fakeUserId))
			.isEqualTo(fakeExpenses);
	}
	
	@Test
	public void findTotalMonthlyExpensesPerYearTest() {
//		Define fake user id
		int fakeUserId = (int)Math.random()*100;
//		Define previous year date
		LocalDate today = LocalDate.now();
//		Define next month date
		LocalDate aYearAgoToday = LocalDate.now().minusYears(1);
//		Create fake list of expenses for the year
		List<Expense> fakeYearExpenses = new ArrayList<Expense>();
		Expense fakeYearExpense1 = new Expense(1, fakeUserId, null, 
											   aYearAgoToday.plusMonths(1), 
											   "Chritsmas tree", 80);
		Expense fakeYearExpense2 = new Expense(2, fakeUserId, null, 
				   							   aYearAgoToday.plusMonths(1), 
				   							   "Christmas dinner", 100);
		fakeYearExpenses.add(fakeYearExpense1);
		fakeYearExpenses.add(fakeYearExpense2);
//		Remove expenses according to date to add realism to the test
		fakeYearExpenses.removeIf(e -> e.getDate().isAfter(today) 
								    || e.getDate().isBefore(aYearAgoToday));
//		Define expectation for finding expenses by userId and dates
		when(expenseRepositoryMock
			 .findByUserIdAndDateBetween(fakeUserId, aYearAgoToday, today))
				.thenReturn(fakeYearExpenses);
//		Create assertion that verifies if the total expenses list returned is not empty
		assertThat(expenseServicesMock.findTotalMonthlyExpensesForYearByUserId(fakeUserId).size())
			.isGreaterThan(0);
//		------------------For verification purposes----------------------------
		System.out.println(aYearAgoToday);
		System.out.println(today);
		System.out.println("Fake expense 1 date: "+fakeYearExpense1.getDate());
		System.out.println("Fake expense 2 date: "+fakeYearExpense2.getDate());
		System.out.println("Result from the service mock: "+
				   expenseServicesMock.findTotalMonthlyExpensesForYearByUserId(fakeUserId));
//		-----------------------------------------------------------------------
	}
	
	@Test
	public void addExpenseTest() {
//		Create fake expense to be added
		Expense fakeExpense = new Expense(1, 1, null, LocalDate.now(), 
				   						  "Parking pass", 30);
//		Define expectation
		when(expenseRepositoryMock.save(fakeExpense)).thenReturn(fakeExpense);
//		Create assertion
		assertThat(expenseServicesMock.addExpense(fakeExpense)).isEqualTo(true);
	}
	
	@Test
	public void updateExpenseTest() {
//		Create fake expense to be updated
		Expense fakeExpense = new Expense(1, 1, null, LocalDate.now().withDayOfMonth(2), 
				   						  "Burger", 60);
//		Define expectation
		when(expenseRepositoryMock.save(fakeExpense)).thenReturn(fakeExpense);
//		Create assertion
		assertThat(expenseServicesMock.updateExpense(fakeExpense)).isEqualTo(true);
	}	
	
}
