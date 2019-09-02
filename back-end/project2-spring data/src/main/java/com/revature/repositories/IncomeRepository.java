package com.revature.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Income;

public interface IncomeRepository<P> extends JpaRepository<Income, Integer> {
	List<Income> findByUserId(int userId);

	List<Income> findByUserIdOrderByIdDesc(int userId);

}