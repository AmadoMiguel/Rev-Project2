package com.revature.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.IncomeType;

public interface IncomeTypeRepository<P> extends JpaRepository<IncomeType, Integer> {
}