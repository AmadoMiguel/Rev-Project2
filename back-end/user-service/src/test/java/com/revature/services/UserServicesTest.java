package com.revature.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.crypto.bcrypt.BCrypt;

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
	
	@Test
	public void checkPasswordTest() {
//		Create fake user for test and assign properties
		Optional<User> fakeUser = Optional.of(new User());
		fakeUser.get().setId(1);
		fakeUser.get().setUsername("fake_user");
		fakeUser.get().setEmail("fake@mail.com");
//		Hash the password and set it to the user
		String hashedPassword = BCrypt.hashpw("123456", BCrypt.gensalt());
		fakeUser.get().setPassword(hashedPassword);
//		Define what the user repository method should return by passing the username
		when(userRepositoryMock.findByUsername(fakeUser.get().getUsername())).thenReturn(fakeUser);
//		Create assertion
		assertThat(userServicesMock.checkPw(fakeUser.get().getUsername(), "123456")).isTrue();
	}
	
	@Test
	public void userLoginTest() {
//		Create fake user for test and assign properties
		Optional<User> fakeUser = Optional.of(new User());
		fakeUser.get().setId(1);
		fakeUser.get().setUsername("mig_am");
		fakeUser.get().setEmail("mig_am@mail.com");
//		Hash the password and set it to the user
		String hashedPassword = BCrypt.hashpw("654321", BCrypt.gensalt());
		fakeUser.get().setPassword(hashedPassword);
//		Define what the user repository method should return
		when(userRepositoryMock.findByUsername(fakeUser.get().getUsername())).thenReturn(fakeUser);
//		Create Assertion to verify that the returned object is instance of ClientInfo class,
//		by verifying that contains the token property instead of being null
		assertThat(userServicesMock.loginUser(fakeUser.get().getUsername(), "654321"))
			.hasFieldOrProperty("token");
	}
	
	@Test
	public void userExistsTest() {
//		Create fake user for test and assign properties
		Optional<User> fakeUser = Optional.of(new User());
		fakeUser.get().setId(1);
		fakeUser.get().setUsername("user_exists");
		fakeUser.get().setEmail("exists@mail.com");
//		Define behaviour of user repository method
		when(userRepositoryMock.findByUsername(fakeUser.get().getUsername())).thenReturn(fakeUser);
//		Create assertion
		assertThat(userServicesMock.userExists(fakeUser.get().getUsername())).isTrue();
	}
	
	@Test
	public void emailUsedTest() {
//		Create fake user for test and assign properties
		Optional<User> fakeUser = Optional.of(new User());
		fakeUser.get().setId(1);
		fakeUser.get().setUsername("email_used");
		fakeUser.get().setEmail("used@mail.com");
//		Define user repository method behaviour
		when(userRepositoryMock.findByEmail(fakeUser.get().getEmail())).thenReturn(fakeUser);
//		Create assertion
		assertThat(userServicesMock.emailUsed(fakeUser.get().getEmail())).isTrue();
	}
	
	@Test
	public void registerUserTest() {
//		Create fake user
		User fakeUser = new User(1, "new_user", "New", 
								 "User", "user@hotmail.com", "123456");
//		Define what the user repository method should return
		when(userRepositoryMock.save(fakeUser)).thenReturn(fakeUser);
//		Create assertion
		assertThat(userServicesMock.registerUser(fakeUser)).isTrue();
	}
	
	@Test
	public void updateUserTest() {
//		Create old user to be updated
		Optional<User> fakeOldUser = Optional.of(new User());
		fakeOldUser.get().setId(1);
		fakeOldUser.get().setUsername("old_user");
		fakeOldUser.get().setFirstName("Test");
		fakeOldUser.get().setLastName("User");
		fakeOldUser.get().setEmail("old@mail.com");
//		Hash the password and set it to the user
		String hashedPassword = BCrypt.hashpw("oldPassword", BCrypt.gensalt());
		fakeOldUser.get().setPassword(hashedPassword);
//		Define behaviour of find user by id
		when(userRepositoryMock.findById(fakeOldUser.get().getId())).thenReturn(fakeOldUser);
//		Create user object with some info updated
//		Let old properties the same as the old user
		User fakeUpdatedUser = new User();
		fakeUpdatedUser.setId(1); // Same id of the old user
		fakeUpdatedUser.setLastName("User");
		fakeUpdatedUser.setEmail("old@mail.com");
		fakeUpdatedUser.setFirstName("New Name");
		fakeUpdatedUser.setPassword(hashedPassword);
//		Define behaviour of save user
		when(userRepositoryMock.save(fakeUpdatedUser)).thenReturn(fakeUpdatedUser);
//		Assertion
		assertThat(userServicesMock.updateUser(fakeUpdatedUser)).isTrue();
	}
	
	@Test
	public void getByIdTest() {
//		Create fakeUser
		Optional<User> fakeUser = Optional.of(new User());
		fakeUser.get().setId(1);
		fakeUser.get().setUsername("searched_user");
		fakeUser.get().setFirstName("Searched");
		fakeUser.get().setLastName("User");
		fakeUser.get().setEmail("searched@mail.com");
//		Define user repository behaviour
		when(userRepositoryMock.findById(fakeUser.get().getId())).thenReturn(fakeUser);
//		Assertion
		assertThat(userServicesMock.getById(fakeUser.get().getId())).isEqualTo(fakeUser);
	}
	
}
