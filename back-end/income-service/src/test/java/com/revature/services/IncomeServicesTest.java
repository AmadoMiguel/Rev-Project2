package com.revature.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.revature.models.Income;
import com.revature.models.IncomeType;
import com.revature.repositories.IncomeRepository;
import com.revature.repositories.IncomeTypeRepository;

@RunWith(MockitoJUnitRunner.class)
public class IncomeServicesTest {
	@InjectMocks
	IncomeService incomeServiceMock;
	
	@Mock
	IncomeRepository<Income> incomeRepositoryMock;
	
	@Mock
	IncomeTypeRepository<IncomeType> incomeTypeRepositoryMock;
	
	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	public void getByIdTest() {
//		Create fake income for test
		Optional<Income> fakeIncome = Optional.of(new Income(1, 1, null, "Wage", 385));
//		Define behavior for income repository method
		when(incomeRepositoryMock.findById(fakeIncome.get().getId())).thenReturn(fakeIncome);
//		Create assertion
		assertThat(incomeServiceMock.getById(fakeIncome.get().getId())).isEqualTo(fakeIncome);
	}
	
	@Test
	public void findIncomesByUserIdTest() {
//		Create fake list of incomes and add some
		List<Income> fakeIncomes = new ArrayList<Income>();
		fakeIncomes.add(new Income(1, 1, null, "Passive", 2300));
		fakeIncomes.add(new Income(2, 1, null, "Hotel", 73000));
//		Define behaviour for income repository method
		when(incomeRepositoryMock.findByUserIdOrderByIdDesc(fakeIncomes.get(0).getUserId()))
			.thenReturn(fakeIncomes);
//		Create assertion
		assertThat(incomeServiceMock.findByUserId(fakeIncomes.get(1).getUserId()))
			.isEqualTo(fakeIncomes);
	}
	
	@Test
	public void findAllIncomeTypesTest() {
//		Create fake list of income types and add some
		List<IncomeType> fakeIncomeTypes = new ArrayList<IncomeType>();
		fakeIncomeTypes.add(new IncomeType(1, "Wage"));
		fakeIncomeTypes.add(new IncomeType(1, "Cashflow"));
//		Define behaviour for income type repository method
		when(incomeTypeRepositoryMock.findAll()).thenReturn(fakeIncomeTypes);
//		Create assertion
		assertThat(incomeServiceMock.findAllIncomeTypes()).isEqualTo(fakeIncomeTypes);
	}
	
	@Test
	public void addIncomeTest() {
//		Create fake income to be added
		Income fakeIncome = new Income(1, 1, null, "Car fun", 90);
//		Define behavior for income repository method
		when(incomeRepositoryMock.save(fakeIncome)).thenReturn(fakeIncome);
//		Create assertion
		assertThat(incomeServiceMock.addIncome(fakeIncome)).isTrue();
	}
	
	@Test
	public void updatedIncomeTest() {
//		Create fake income to be updated
		Income fakeIncome = new Income(1, 1, null, "Car fun", 90);
//		Define behavior for income repository method
		when(incomeRepositoryMock.save(fakeIncome)).thenReturn(fakeIncome);
//		Create assertion
		assertThat(incomeServiceMock.updateIncome(fakeIncome)).isTrue();
	}
	
}
