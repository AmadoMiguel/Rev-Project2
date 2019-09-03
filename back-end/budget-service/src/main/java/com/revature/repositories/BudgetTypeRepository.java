package com.revature.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.BudgetType;

public interface BudgetTypeRepository<P> extends JpaRepository<BudgetType, Integer> {

}