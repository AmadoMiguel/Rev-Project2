package com.revature.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.ExpenseType;

public interface ExpenseTypeRepository<P> extends JpaRepository<ExpenseType, Integer> {
}