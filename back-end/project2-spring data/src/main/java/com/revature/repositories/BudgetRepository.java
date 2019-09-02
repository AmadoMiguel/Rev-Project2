package com.revature.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Budget;

public interface BudgetRepository<P> extends JpaRepository<Budget, Integer> {
	List<Budget> findByUserId(int userId);

}