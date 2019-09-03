
package com.revature.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.revature.models.Budget;
import com.revature.models.BudgetType;
import com.revature.services.BudgetService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE })
public class BudgetController {

	BudgetService budgetService;

	@Autowired
	public BudgetController(BudgetService budgetService) {
		super();
		this.budgetService = budgetService;
	}

	@RequestMapping(value = "/budget/{id}", method = RequestMethod.GET)
	public @ResponseBody Optional<Budget> getBudgetById(@PathVariable int id) {
		return budgetService.getById(id);
	}

	@RequestMapping(value = "/budget/user/{userId}", method = RequestMethod.GET)
	public List<Budget> getBudgetByUserId(@PathVariable int userId) {
		return budgetService.findByUserId(userId);
	}

	@RequestMapping(value = "/budget/type/{id}", method = RequestMethod.GET)
	public Optional<BudgetType> getBudgetTypeById(@PathVariable int id) {
		return budgetService.findBudgetTypeById(id);
	}

	@RequestMapping(value = "/budget/types", method = RequestMethod.GET)
	public List<BudgetType> getBudgetTypes() {
		return budgetService.findAllBudgetTypes();
	}

	@RequestMapping(value = "/budget/delete/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteBudget(@PathVariable int id) {
		budgetService.deleteBudget(id);
		return HttpStatus.NO_CONTENT;
	}

	@RequestMapping(value = "/budget", method = RequestMethod.POST)
	public Budget insertBudget(@RequestBody Budget budget) {
		return budgetService.addBudget(budget) ? budget : null;
	}

	@RequestMapping(value = "/budget", method = RequestMethod.PUT)
	public HttpStatus updateBudget(@RequestBody Budget budget) {
		return budgetService.updateBudget(budget) ? HttpStatus.ACCEPTED : HttpStatus.BAD_REQUEST;
	}

	@RequestMapping(value = "/user/budget/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteAllByUser(@PathVariable int id) {
		budgetService.deleteByUserId(id);
		return HttpStatus.NO_CONTENT;
	}

//	@RequestMapping(value = "/budget", method = RequestMethod.GET)
//	public List<Budget> getAll() {
//		return BudgetService.getAllBudgets();
//	}
}