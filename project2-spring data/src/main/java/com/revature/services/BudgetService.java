package com.revature.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.models.Budget;
import com.revature.models.BudgetType;
import com.revature.repositories.BudgetRepository;
import com.revature.repositories.BudgetTypeRepository;

@Service
public class BudgetService {
	BudgetRepository<Budget> budgetRepository;
	BudgetTypeRepository<BudgetType> budgetTypeRepository;

	@Autowired
	public BudgetService(BudgetRepository<Budget> budgetRepository,
			BudgetTypeRepository<BudgetType> budgetTypeRepository) {
		super();
		this.budgetRepository = budgetRepository;
		this.budgetTypeRepository = budgetTypeRepository;
	}

//	@Transactional
//	public List<Budget> getAllBudgets() {
//		return (List<Budget>) BudgetRepository.findAll();
//	}
	public Optional<Budget> getById(int id) {
		return budgetRepository.findById(id);
	}

	public List<Budget> findByUserId(int userId) {
		return budgetRepository.findByUserId(userId);
	}

	public Optional<BudgetType> findBudgetTypeById(int id) {
		return budgetTypeRepository.findById(id);
	}

	public List<BudgetType> findAllBudgetTypes() {
		return budgetTypeRepository.findAll();
	}

	public void deleteBudget(int id) {
		budgetRepository.deleteById(id);
	}

	public boolean addBudget(Budget budget) {
		return budgetRepository.save(budget) != null;
	}

	public boolean updateBudget(Budget budget) {
		return budgetRepository.save(budget) != null;
	}

	public void deleteByUserId(int userId) {
		List<Budget> toBeGone = budgetRepository.findByUserId(userId);
		for (Budget b : toBeGone) {
			budgetRepository.deleteById(b.getId());
		}
		return;
	}
}
