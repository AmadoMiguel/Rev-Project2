package com.revature.controller;

import static org.hamcrest.CoreMatchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.models.TotalExpense;
import com.revature.services.ExpenseService;


@RunWith(SpringRunner.class)
@WebMvcTest(ExpenseController.class)
public class ExpensesControllerTest {
//	Initial setup for the tests
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean 
	private ExpenseService expenseServiceMock;
	
//	To handle json format conversion from/to string
	ObjectMapper objectMapper = new ObjectMapper();
	
//	Begin tests
	@Test
	 public void getExpensesByUserIdTest() throws Exception {
//		Create fake expenses in list
		List<Expense> fakeExpenses = new ArrayList<Expense>();
//		Add expenses to the list
		Expense fExp1 = new Expense(1, 1, null, 
									LocalDate.now(), "Some expense", 50);
		Expense fExp2 = new Expense(2, 1, null, 
				LocalDate.now(), "Some other expense", 40);
		fakeExpenses.add(fExp1);
		fakeExpenses.add(fExp2);
//		Define expectation for the expense service
		when(expenseServiceMock.findByUserId(1)).thenReturn(fakeExpenses);
//		Check mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.get("/expense/user/{userId}",1))
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("\"description\":\"Some expense\"")));
	 }
	
	@Test
	public void getThisMonthExpensesTest() throws Exception {
//		Create fake list of expenses
		List<Expense> fakeExpenses = new ArrayList<Expense>();
//		Add expenses to the list
		Expense fExp1 = new Expense(1, 1, null, 
									LocalDate.now(), "Expense1", 15.34);
		Expense fExp2 = new Expense(2, 1, null, 
									LocalDate.now(), "Expense2", 25.81);
		fakeExpenses.add(fExp1);
		fakeExpenses.add(fExp2);
//		Define expectation for the expense service method
		when(expenseServiceMock.findMonthlyExpensesByUserId(1)).thenReturn(fakeExpenses);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.get("/expense/user/{userId}/monthly",1))
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("\"description\":\"Expense1\"")));
	}
	
	@Test
	public void getPastYearExpensesTest() throws Exception {
//		Create fake list of expenses
		List<TotalExpense> fakeTotalExpenses = new ArrayList<TotalExpense>();
//		Add fake expenses to the list
		TotalExpense fExp1 = new TotalExpense("January", 420.5);
		TotalExpense fExp2 = new TotalExpense("September", 580.23);
		fakeTotalExpenses.add(fExp1);
		fakeTotalExpenses.add(fExp2);
//		Define what the expense service method should return
		when(expenseServiceMock.findTotalMonthlyExpensesForYearByUserId(1))
			.thenReturn(fakeTotalExpenses);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.get("/expense/user/{userId}/yearly",1))
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("\"month\":\"January\"")));
	}
	
	@Test
	public void findExpenseTypesTest() throws Exception {
//		Create fake list of expense types
		List<ExpenseType> fakeExpenseTypes = new ArrayList<ExpenseType>();
//		Add fake expense type objects to the list
		ExpenseType fExpTyp1 = new ExpenseType(1, "Bills");
		ExpenseType fExpTyp2 = new ExpenseType(2, "Food");
		ExpenseType fExpTyp3 = new ExpenseType(3, "Entertainment");
		fakeExpenseTypes.add(fExpTyp1);
		fakeExpenseTypes.add(fExpTyp2);
		fakeExpenseTypes.add(fExpTyp3);
//		Set expectation for expense service method
		when(expenseServiceMock.findAllExpenseTypes()).thenReturn(fakeExpenseTypes);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.get("/expense/types"))
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("\"type\":\"Bills\"")));
	}
	
	@Test
	public void deleteExpenseById() throws Exception {
//		Create fake expense to be deleted
		Expense fakeExpense = new Expense(1, 1, null, 
										  LocalDate.now().minusMonths(3), "Sprite", 3);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.delete("/expense/{id}",fakeExpense.getId()))
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("NO_CONTENT")));
	}
	
	@Test
	public void insertExpenseTest() throws Exception {
//		Create fake expense to be added
		ExpenseType fakeExpenseType = new ExpenseType(1, "Bills");
		LocalDate date = LocalDate.now().plusMonths(1).withDayOfMonth(10);
		Expense fakeExpense = new Expense(1, 1, fakeExpenseType, 
				  				          date, "Meal", 8.5);
//		Parse the local date object in the string and convert it to format
//		YYYY-MM-DD to avoid bad request issues during test
		String expenseAsString = objectMapper.writeValueAsString(fakeExpense);
		JSONObject expenseJson = new JSONObject(expenseAsString);
		expenseJson.put
			("date", ""+date.getYear()+"-"+date.getMonthValue()+"-"+date.getDayOfMonth());
//		when(expenseServiceMock.updateExpense(fakeExpense)).thenReturn(true);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.post("/expense")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(expenseJson.toString()))
				.andDo(print())
				.andExpect(status().isOk());
	}
	
	@Test
	public void updateExpenseTest() throws Exception {
//		Create expense to be updated
		ExpenseType fakeExpenseType = new ExpenseType(2, "Food");
		LocalDate date = LocalDate.parse("2019-10-10");
		Expense fakeExpense = new Expense(1, 3, fakeExpenseType, 
				  				          date, "Lunch", 0.0);
//		Convert to string
		String expenseAsString = objectMapper.writeValueAsString(fakeExpense);
		JSONObject expenseJson = new JSONObject(expenseAsString);
		expenseJson.put
		("date", ""+date.getYear()+"-"+date.getMonthValue()+"-"+date.getDayOfMonth());
//		when(expenseServiceMock.updateExpense(fakeExpense)).thenReturn(true);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.put("/expense",fakeExpense)
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(expenseJson.toString())
				.accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
				.andExpect(status().isOk());
	}
	
	@Test
	public void deleteAllUserExpensesTest() throws Exception {
//		Create fake user id
		int fakeUserId = (int)Math.random()*100;
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.delete("/expense/user/{id}",fakeUserId))
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("NO_CONTENT")));
	}
}
