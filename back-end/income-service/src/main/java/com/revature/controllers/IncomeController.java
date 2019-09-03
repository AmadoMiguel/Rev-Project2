
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

import com.revature.models.Income;
import com.revature.models.IncomeType;
import com.revature.services.IncomeService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE })
public class IncomeController {

	IncomeService incomeService;

	@Autowired
	public IncomeController(IncomeService incomeService) {
		super();
		this.incomeService = incomeService;
	}

	@RequestMapping(value = "/income/{id}", method = RequestMethod.GET)
	public @ResponseBody Optional<Income> getIncomeById(@PathVariable int id) {
		return incomeService.getById(id);
	}

	@RequestMapping(value = "/income/user/{userId}", method = RequestMethod.GET)
	public List<Income> getIncomeByUserId(@PathVariable int userId) {
		return incomeService.findByUserId(userId);
	}

	@RequestMapping(value = "/income/type/{id}", method = RequestMethod.GET)
	public Optional<IncomeType> getIncomeTypeById(@PathVariable int id) {
		return incomeService.findIncomeTypeById(id);
	}

	@RequestMapping(value = "/income/types", method = RequestMethod.GET)
	public List<IncomeType> getIncomeTypes() {
		return incomeService.findAllIncomeTypes();
	}

	@RequestMapping(value = "/income/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteIncome(@PathVariable int id) {
		incomeService.deleteIncome(id);
		return HttpStatus.NO_CONTENT;
	}

	@RequestMapping(value = "/income", method = RequestMethod.POST)
	public HttpStatus insertIncome(@RequestBody Income income) {
		return incomeService.addIncome(income) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
	}

	@RequestMapping(value = "/income", method = RequestMethod.PUT)
	public HttpStatus updateIncome(@RequestBody Income income) {
		return incomeService.updateIncome(income) ? HttpStatus.ACCEPTED : HttpStatus.BAD_REQUEST;
	}

	@RequestMapping(value = "/user/income/{id}", method = RequestMethod.DELETE)
	public HttpStatus deleteAllIncomes(@PathVariable int id) {
		incomeService.deleteByUserId(id);
		return HttpStatus.NO_CONTENT;
	}

//	@RequestMapping(value = "/income", method = RequestMethod.GET)
//	public List<Income> getAll() {
//		return IncomeService.getAllIncomes();
//	}
}