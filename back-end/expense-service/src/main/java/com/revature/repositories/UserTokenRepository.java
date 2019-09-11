package com.revature.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.dto.TokenDto;

public interface UserTokenRepository<P> extends JpaRepository<TokenDto, Integer>  {

	Optional<TokenDto> findByUserId(int userId);

}
