package com.revature.services;


import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import com.revature.models.User;

@RunWith(MockitoJUnitRunner.class)
public class JWTServicesTest {
	
	@Test
	public void createJWTTest() {
//		Create fake user for the test
		User fakeUser = new User(1, "username", null, 
								 null, "user@mail.com", null);
//		Create assertion to verify returned string is not equal to empty string
		assertThat(JWTService.createJWT(String.valueOf(fakeUser.getId()), fakeUser.getUsername(), 
										fakeUser.getEmail(), 0)).isNotEqualTo("");
	}
	
	@Test
	public void checkAuthByIdTest() {
//		Create new user
		User fakeUser = new User(1, "username", "First", 
				 				 "Last", "user@mail.com", "hashedpassword");
//		Create JWT for test
		String fakeToken = JWTService.createJWT(String.valueOf(fakeUser.getId()), 
												fakeUser.getUsername(), fakeUser.getEmail(),0);
//		Create assertion
		assertThat(JWTService.checkAuthByID(fakeToken, fakeUser.getId())).isTrue();
	}
	
	@Test
	public void checkAuthTest() {
//		Create new user
		User fakeUser = new User(1, "username", "First", 
				 				 "Last", "user@mail.com", "hashedpassword");
//		Create JWT for test
		String fakeToken = JWTService.createJWT(String.valueOf(fakeUser.getId()), 
												fakeUser.getUsername(), fakeUser.getEmail(),0);
//		Create assertion
		assertThat(JWTService.checkAuth(fakeToken)).isTrue();
	}
	
	@Test
	public void checkAuthByUsernameTest() {
//		Create new user
		User fakeUser = new User(1, "username", "First", 
				 				 "Last", "user@mail.com", "hashedpassword");
//		Create JWT for test
		String fakeToken = JWTService.createJWT(String.valueOf(fakeUser.getId()), 
												fakeUser.getUsername(), fakeUser.getEmail(),0);
//		Create assertion
		assertThat(JWTService.checkAuthByUsername(fakeToken,fakeUser.getUsername())).isTrue();
	}
	
}
