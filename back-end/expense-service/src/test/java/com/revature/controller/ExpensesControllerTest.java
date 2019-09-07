package com.revature.controller;


import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.ExpenseServiceApplication;
import com.revature.models.Expense;
import com.revature.models.ExpenseType;
import com.revature.repositories.ExpenseRepository;
import com.revature.repositories.ExpenseTypeRepository;
import com.revature.services.ExpenseService;

import feign.Response;

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
				.andDo(print())
				.andExpect(status().isOk())
				.andExpect(content()
						.string(containsString("\"id\":1")));
	 }
	
}
