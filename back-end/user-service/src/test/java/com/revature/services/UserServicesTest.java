package com.revature.services;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.revature.models.User;
import com.revature.repositories.UserRepository;

//Unit testing for the UserService methods using JUnit and Mockito
@RunWith(MockitoJUnitRunner.class)
public class UserServicesTest {
//	Required resources
	@InjectMocks
	private UserService userServicesMock;
	
	@Mock
	private UserRepository<User> userRepositoryMock;
	
	@Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);
    }
	
	
	
}
