package com.revature.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.models.Income;
import com.revature.models.IncomeType;
import com.revature.repositories.IncomeRepository;
import com.revature.repositories.IncomeTypeRepository;

@Service
public class IncomeService {
	IncomeRepository<Income> incomeRepository;
	IncomeTypeRepository<IncomeType> incomeTypeRepository;

	@Autowired
	public IncomeService(IncomeRepository<Income> incomeRepository,
			IncomeTypeRepository<IncomeType> incomeTypeRepository) {
		super();
		this.incomeRepository = incomeRepository;
		this.incomeTypeRepository = incomeTypeRepository;
	}

//	@Transactional
//	public List<income> getAllincomes() {
//		return (List<income>) incomeRepository.findAll();
//	}
	public Optional<Income> getById(int id) {
		return incomeRepository.findById(id);
	}

	public List<Income> findByUserId(int userId) {
		return incomeRepository.findByUserIdOrderByIdDesc(userId);
	}

	public Optional<IncomeType> findIncomeTypeById(int id) {
		return incomeTypeRepository.findById(id);
	}

	public List<IncomeType> findAllIncomeTypes() {
		return incomeTypeRepository.findAll();
	}

	public void deleteIncome(int id) {
		incomeRepository.deleteById(id);
	}

	public boolean addIncome(Income income) {
		return incomeRepository.save(income) != null;
	}

	public boolean updateIncome(Income income) {
		return incomeRepository.save(income) != null;
	}

	public void deleteByUserId(int userId) {
		List<Income> toBeGone = incomeRepository.findByUserId(userId);
		for (Income b : toBeGone) {
			incomeRepository.deleteById(b.getId());
		}
		return;
	}

}
