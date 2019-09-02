package com.revature.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.models.Family;

public interface FamilyRepository<P> extends JpaRepository<Family, Integer> {

}
