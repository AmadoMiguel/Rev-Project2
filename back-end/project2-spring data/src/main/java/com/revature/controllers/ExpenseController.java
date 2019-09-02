
package com.revature.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.models.TotalExpense;
import com.revature.services.ExpenseService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE })

@RequestMapping("expense")
public class ExpenseController {

	ExpenseService expenseService;

	@Autowired
	public ExpenseController(ExpenseService expenseService) {
		super();
		this.expenseService = expenseService;
	}

//	Endpoint for getting expense by id
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Optional<Expense> getExpenseById(@PathVariable int id) {
		return expenseService.getById(id);
	}

//	Endpoint for getting expenses by user id
	@RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
	public List<Expense> getExpenseByUserId(@PathVariable int userId) {
		return expenseService.findByUserId(userId);
	}

	@RequestMapping(value = "/user/{userId}/monthly", method = RequestMethod.GET)
	public List<Expense> getMonthlyExpensesByUserId(@PathVariable int userId) {
		return expenseService.findMonthlyExpensesByUserId(userId);
	}

	@GetMapping("/user/{userId}/yearly")
	public List<TotalExpense> getPastYearsExpensesByUserId(@PathVariable int userId) {
		return expenseService.findTotalMonthlyExpensesForYearByUserId(userId);
	}

//	Endpoint for getting expenses by type id
	@RequestMapping(value = "/type/{id}", method = RequestMethod.GET)
	public Optional<ExpenseType> getExpenseTypeById(@PathVariable int id) {
		return expenseService.findExpenseTypeById(id);
	}

//	Endpoint for getting expenses by type id
	@RequestMapping(value = "/user/{userId}/type/{type}", method = RequestMethod.GET)
	public List<Expense> getExpenseByUserIdAndExpenseType(@PathVariable int userId, @PathVariable int type) {
//		Receive the type from the request body
		Optional<ExpenseType> expenseType = expenseService.findExpenseTypeById(type);
//		System.out.println(expenseType);
		return expenseService.findExpenseByUserIdAndExpenseType(userId, expenseType);
	}

//	Endpoint for getting expenses by type id
	@RequestMapping(value = "/types", method = RequestMethod.GET)
	public List<ExpenseType> getExpenseTypes() {
		return expenseService.findAllExpenseTypes();
	}

//	Endpoint for deleting expense by id
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteExpense(@PathVariable int id) {
		expenseService.deleteExpense(id);
		return HttpStatus.NO_CONTENT;
	}

//	Endpoint for creating a new expense
	@RequestMapping(value = "", method = RequestMethod.POST)
	public Expense insertExpense(@RequestBody Expense expense) {
		return expenseService.addExpense(expense) ? expense : null;
	}

//	Endpoint for modifying an existing expense
	@RequestMapping(value = "", method = RequestMethod.PUT)
	public HttpStatus updateExpense(@RequestBody Expense expense) {
		return expenseService.updateExpense(expense) ? HttpStatus.ACCEPTED : HttpStatus.BAD_REQUEST;
	}

	@RequestMapping(value = "/user/expense/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteAllExpenses(@PathVariable int id) {
		expenseService.deleteByUserId(id);
		return HttpStatus.NO_CONTENT;
	}

//	@RequestMapping(value = "/expense", method = RequestMethod.GET)
//	public List<Expense> getAll() {
//		return ExpenseService.getAllExpenses();
//	}
}