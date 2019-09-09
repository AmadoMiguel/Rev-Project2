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

import com.revature.models.Budget;
import com.revature.models.BudgetType;
import com.revature.repositories.BudgetRepository;
import com.revature.repositories.BudgetTypeRepository;

@RunWith(MockitoJUnitRunner.class)
public class BudgetServiceTest {
	
	@InjectMocks
	BudgetService budgetServiceMock;
	
	@Mock
	BudgetRepository<Budget> budgetRepositoryMock;
	
	@Mock
	BudgetTypeRepository<BudgetType> budgetTypeRepositoryMock;
	
	@Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);
    }
	
	@Test
	public void getByIdTest() {
//		Create fake budget
		Optional<Budget> fakeBudget = Optional.of(new Budget(1, 1, "Food", 60, null));
//		Define behavior for budget repository method
		when(budgetRepositoryMock.findById(fakeBudget.get().getId())).thenReturn(fakeBudget);
//		Create assertion
		assertThat(budgetServiceMock.getById(fakeBudget.get().getId())).isEqualTo(fakeBudget);
	}
	
	@Test
	public void findByUserIdTest() {
//		Create fake list of budgets and add some 
		List<Budget> fakeBudgets = new ArrayList<Budget>();
		Budget fBud1 = new Budget(1, 1, "Car", 100, null);
		Budget fBud2 = new Budget(2, 1, "Door", 100, null);
		fakeBudgets.add(fBud1);
		fakeBudgets.add(fBud2);
//		Define behavior for budget repository method
		when(budgetRepositoryMock.findByUserId(fakeBudgets.get(0).getUserId()))
			.thenReturn(fakeBudgets);
//		Create assertion
		assertThat(budgetServiceMock.findByUserId(fakeBudgets.get(0).getUserId()))
			.isEqualTo(fakeBudgets);
	}
	
	@Test
	public void findAllBudgetTypesTest() {
//		Create fake list of budget types and add some
		List<BudgetType> fakeBudgetTypes = new ArrayList<BudgetType>();
		BudgetType fBudType1 = new BudgetType(1, "Bills");
		BudgetType fBudType2 = new BudgetType(2, "Food");
		fakeBudgetTypes.add(fBudType1);
		fakeBudgetTypes.add(fBudType2);
//		Define behaviour for budget repository method
		when(budgetTypeRepositoryMock.findAll()).thenReturn(fakeBudgetTypes);
//		Create assertion
		assertThat(budgetServiceMock.findAllBudgetTypes()).isEqualTo(fakeBudgetTypes);
	}
	
	@Test
	public void addBudgetTest() {
//		Create fake budget
		Budget fakeBudget = new Budget(1, 1, "Food", 60, null);
//		Define behavior for budget repository method
		when(budgetRepositoryMock.save(fakeBudget)).thenReturn(fakeBudget);
//		Create assertion
		assertThat(budgetServiceMock.addBudget(fakeBudget)).isTrue();
	}
	
	@Test
	public void updateBudgetTest() {
//		Create fake budget
		Budget fakeBudget = new Budget(1, 1, "Food", 60, null);
//		Define behavior for budget repository method
		when(budgetRepositoryMock.save(fakeBudget)).thenReturn(fakeBudget);
//		Create assertion
		assertThat(budgetServiceMock.updateBudget(fakeBudget)).isTrue();
	}
	
}
