package com.revature.services;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.revature.dto.TokenDto;
import com.revature.dto.UserDto;
import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.models.TotalExpense;
import com.revature.repositories.ExpenseRepository;
import com.revature.repositories.ExpenseTypeRepository;
import com.revature.repositories.UserTokenRepository;

@Service
public class ExpenseService {
	ExpenseRepository<Expense> expenseRepository;
	ExpenseTypeRepository<ExpenseType> expenseTypeRepository;
	UserTokenRepository<TokenDto> userTokenRepository;

	@Autowired
	public ExpenseService(ExpenseRepository<Expense> expenseRepository,
			ExpenseTypeRepository<ExpenseType> expenseTypeRepository,
			UserTokenRepository<TokenDto> userTokenRepository) {
		super();
		this.expenseRepository = expenseRepository;
		this.expenseTypeRepository = expenseTypeRepository;
		this.userTokenRepository = userTokenRepository;
	}
	

	public List<Expense> findExpenseByUserIdAndExpenseType(int userId, Optional<ExpenseType> expenseType) {
		return expenseRepository.findByUserIdAndExpenseType(userId, expenseType);
	}

	// Get expense by ID
	public Optional<Expense> getById(int id) {
		return expenseRepository.findById(id);
	}

	// Get expense by user id
//	Apply circuit breaker in case user service is shut down/fails
	@HystrixCommand(fallbackMethod = "findByUserIdFallback")
	public List<Expense> findByUserId(int userId) {
//		Request user info from user service
		RestTemplate restTemplate = new RestTemplate();
//		Retrieve token from the repository
		Optional<TokenDto> currentUserToken = userTokenRepository.findByUserId(userId);
		if(currentUserToken.isPresent()) {
//			Set the authorization headers
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", currentUserToken.get().getCurrentUserToken());
//			Create  http entity request
			HttpEntity<String> headersEntity= new HttpEntity<String>(headers);
			UserDto foundUser = restTemplate.exchange("http://localhost:8765/user-service/user/"+userId
					  								 ,HttpMethod.GET, headersEntity, 
					  								 UserDto.class).getBody();
			List<Expense> foundExpenses = expenseRepository.findByUserIdOrderByIdDesc(userId);
			//Set user dto to each one of the expenses
			if(foundExpenses != null) {
			for(Expense e: foundExpenses) {
				e.setUser(foundUser);
			}
				return foundExpenses;
			} else {
				return foundExpenses;
			}
		} else {
			return null;
		}
	}
//	Fallback method that is called in case the user service is not working. The only information
//	sent from this method is the user id
	public List<Expense> findByUserIdFallback(int userId) {
		return expenseRepository.findByUserId(userId);
	}
	
	public void saveCurrentUserToken(TokenDto userToken) {
//		Search if there was a token assigned previously for the user
		Optional<TokenDto> currentUserToken = userTokenRepository.findByUserId(userToken.getUserId());
		if(currentUserToken.isPresent()) {
//			Update the existing token for the user
			userTokenRepository.save(currentUserToken.get());
		} else {
//			Save the new token with user id
			userTokenRepository.save(userToken);
		}
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
	@HystrixCommand(fallbackMethod="findMonthlyExpensesByUserIdFallback")
	public List<Expense> findMonthlyExpensesByUserId(int userId) {
//		Define previous month date
		LocalDate currMonthStart = LocalDate.now().withDayOfMonth(1);
//		Define next month date
		LocalDate nextMonthStart = LocalDate.now().plusMonths(1).withDayOfMonth(1);
		List<Expense> foundExpenses = expenseRepository
					.findByUserIdAndDateBetween(userId, currMonthStart, nextMonthStart);
//		Retrieve token from the repository
		Optional<TokenDto> currentUserToken = userTokenRepository.findByUserId(userId);
		if (currentUserToken.isPresent()) {
//			Prepare the template
			RestTemplate restTemplate = new RestTemplate();
//			Set the authorization headers
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", currentUserToken.get().getCurrentUserToken());
//			Create  http entity request
			HttpEntity<String> headersEntity= new HttpEntity<String>(headers);
			UserDto foundUser = restTemplate.exchange("http://localhost:8765/user-service/user/"+userId
													  ,HttpMethod.GET, headersEntity, 
													  UserDto.class).getBody();
//			Assign user to the expenses
			for(Expense e : foundExpenses) {
				e.setUser(foundUser);
			} 
			return foundExpenses;
		} else {
			return null;
		}
	}
	
//	Fallback method for monthly user expenses without the complete user information
	public List<Expense> findMonthlyExpensesByUserIdFallback(int userId) {
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

	public Expense addExpense(Expense expense) {
		return expenseRepository.save(expense);
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
