package com.revature.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.controllers.IncomeController;
import com.revature.models.Income;
import com.revature.models.IncomeType;
import com.revature.services.IncomeService;

@RunWith(SpringRunner.class)
@WebMvcTest(IncomeController.class)
public class IncomeControllerTest {
	
	@Autowired
	MockMvc mockMvc;
	
	@MockBean
	IncomeService incomeServiceMock;
	
	ObjectMapper objectMapper = new ObjectMapper();
	
	@Test
	public void getIncomesByUserIdTest() throws Exception {
//		Create fake of incomes list and add some
		List<Income> fakeIncomes = new ArrayList<Income>();
		fakeIncomes.add(new Income(1, 1, null, "Wage", 380));
		fakeIncomes.add(new Income(2, 1, null, "Cashflow", 3980));
//		Define behavior for income service method
		when(incomeServiceMock.findByUserId(fakeIncomes.get(0).getUserId()))
			.thenReturn(fakeIncomes);
//		Perform mvc test
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders
						.get("/income/user/{userId}",fakeIncomes.get(1).getUserId()))
						.andExpect(status().isOk())
						.andReturn();
//		Get result from the test as string
		String resultAsString = result.getResponse().getContentAsString();
//		Transform it to the corresponding format
		List<Income> incomesFromController = objectMapper.readValue(resultAsString, 
														new TypeReference<List<Income>>() {});
//		Create assertion
		assertThat(incomesFromController).isEqualTo(fakeIncomes);
	}
	
	@Test
	public void getIncomeTypesTest() throws Exception {
//		Create fake list of income types and add some
		List<IncomeType> fakeIncomeTypes = new ArrayList<IncomeType>();
		fakeIncomeTypes.add(new IncomeType(1, "Bills"));
		fakeIncomeTypes.add(new IncomeType(2, "Food"));
//		Define behavior for income service method
		when(incomeServiceMock.findAllIncomeTypes()).thenReturn(fakeIncomeTypes);
//		Perform mvc test
		MvcResult response = mockMvc.perform(MockMvcRequestBuilders
											.get("/income/types"))
											.andExpect(status().isOk())
											.andExpect(jsonPath("$[0].type",is("Bills")))
											.andReturn();
//		Compare to the fake income types list
		String resultAsString = response.getResponse().getContentAsString();
//		Transform it to the corresponding format
		List<IncomeType> incomeTypesFromController = objectMapper.readValue(resultAsString, 
														new TypeReference<List<IncomeType>>() {});
//		Create assertion
		assertThat(incomeTypesFromController).isEqualTo(fakeIncomeTypes);
	}
	
	@Test
	public void deleteIncomeTest() throws Exception {
//		Create fake income id
		int fakeIncomeId = (int)Math.random()*100;
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.delete("/income/{id}",fakeIncomeId))
						.andExpect(content().string(containsString("NO_CONTENT")));
	}
	
	@Test
	public void insertIncomeTest() throws Exception {
//		Create fake income
		Income fakeIncome = new Income(1, 1, null, "Wage", 1500);
//		Define behavior for income service method
		when(incomeServiceMock.addIncome(fakeIncome)).thenReturn(true);
//		Handle object conversion
		String incomeAsString = objectMapper.writeValueAsString(fakeIncome);
		JSONObject incomeAsJson = new JSONObject(incomeAsString);
//		Perform mvc test
		MvcResult response = mockMvc.perform(MockMvcRequestBuilders
											 .post("/income")
											 .accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
											 .content(incomeAsJson.toString())
											 .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
											 .andReturn();
//		Get response as string
		String responseAsString = response.getResponse().getContentAsString();
//		Create assertion
		assertThat(responseAsString).isEqualTo("\"CREATED\"");
	}
	
	@Test
	public void updateIncomeTest() throws Exception {
//		Create fake income
		Income fakeIncome = new Income(1, 1, null, "Wage", 1500);
//		Define behavior for income service method
		when(incomeServiceMock.addIncome(fakeIncome)).thenReturn(true);
//		Handle object conversion
		String incomeAsString = objectMapper.writeValueAsString(fakeIncome);
		JSONObject incomeAsJson = new JSONObject(incomeAsString);
//		Perform mvc test
		MvcResult response = mockMvc.perform(MockMvcRequestBuilders
											 .put("/income")
											 .accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
											 .content(incomeAsJson.toString())
											 .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
											 .andReturn();
//		Get response as string
		String responseAsString = response.getResponse().getContentAsString();
//		Create assertion
		assertThat(responseAsString).isEqualTo("\"ACCEPTED\"");
	}

}
