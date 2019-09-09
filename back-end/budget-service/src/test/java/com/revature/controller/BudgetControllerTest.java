package com.revature.controller;

import static org.hamcrest.CoreMatchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.revature.controllers.BudgetController;
import com.revature.models.Budget;
import com.revature.models.BudgetType;
import com.revature.services.BudgetService;

@RunWith(SpringRunner.class)
@WebMvcTest(BudgetController.class)
public class BudgetControllerTest {
	@Autowired
	MockMvc mockMvc;
	
	@MockBean
	BudgetService budgetServiceMock;
	
//	Handle json format conversion from/to string
	ObjectMapper objectMapper = new ObjectMapper();
	
	@Test
	public void findBudgetByUserIdTest() throws Exception {
//		Create fake list of budgets
		List<Budget> fakeBudgets = new ArrayList<Budget>();
//		Add some budgets to the list
		Budget fBud1 = new Budget(1, 1, "Movies", 20, null);
		Budget fBud2 = new Budget(1, 1, "Medicine", 60, null);
		fakeBudgets.add(fBud1);
		fakeBudgets.add(fBud2);
//		Define behavior for the budget service method
		when(budgetServiceMock.findByUserId(fakeBudgets.get(0).getUserId()))
			.thenReturn(fakeBudgets);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.get("/budget/user/{userId}",fakeBudgets.get(0).getUserId()))
						.andExpect(status().isOk())
						.andExpect(content().string(containsString("\"userId\":1")));
	}
	
	@Test
	public void findBudgetTypesTest() throws Exception {
//		Create fake list of budget types and add some
		List<BudgetType> fakeBudgetTypes = new ArrayList<BudgetType>();
		BudgetType fBudTyp1 = new BudgetType(1, "Bills");
		BudgetType fBudTyp2 = new BudgetType(2, "Food");
		fakeBudgetTypes.add(fBudTyp1);
		fakeBudgetTypes.add(fBudTyp2);
//		Define behavior for the budget service method
		when(budgetServiceMock.findAllBudgetTypes()).thenReturn(fakeBudgetTypes);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.get("/budget/types"))
						.andExpect(status().isOk())
						.andExpect(content().string(containsString("\"type\":\"Bills\"")));
	}
	
	@Test
	public void deleteBudgetByIdTest() throws Exception {
//		Create fake budget id
		int fakeBudgetId = (int)Math.random()*100;
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders.delete("/budget/delete/{id}",fakeBudgetId))
						.andExpect(status().isOk())
						.andExpect(content().string(containsString("NO_CONTENT")));
	}
	
	@Test
	public void insertBudgetTest() throws Exception {
//		Create fake budget
		Budget fakeBudget = new Budget(1, 1, "For emergency", 1000, null);
//		Define what the service method should return
		when(budgetServiceMock.addBudget(fakeBudget)).thenReturn(true);
//		Handle budget object conversion
		String budgetAsString = objectMapper.writeValueAsString(fakeBudget);
		JSONObject budgetAsJson = new JSONObject(budgetAsString);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.post("/budget")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(budgetAsJson.toString())
						.accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
						.andExpect(status().isOk())
						.andExpect(content()
									.string(containsString("\"description\":\"For emergency\"")));
	}
	
	@Test
	public void updateBudgetTest() throws Exception {
//		Create fake budget object
		Budget fakeBudget = new Budget(1, 1, "Just in case", 500, null);
//		Define behavior for the budget service method
		when(budgetServiceMock.updateBudget(fakeBudget)).thenReturn(true);
//		Handle object conversion
		String budgetAsString = objectMapper.writeValueAsString(fakeBudget);
		JSONObject budgetAsJson = new JSONObject(budgetAsString);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.put("/budget")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(budgetAsJson.toString()))
						.andExpect(status().isOk())
						.andExpect(content().string(containsString("ACCEPTED")));
	}
	
	@Test
	public void deleteBudgetsByUserIdTest() throws Exception {
//		Create fake user id
		int fakeUserId = (int)Math.random()*100;
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.delete("/user/budget/{id}",fakeUserId))
						.andExpect(status().isOk())
						.andExpect(content().string(containsString("NO_CONTENT")));					
	}
	
}
