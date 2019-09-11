package com.revature.controller;

import static org.hamcrest.CoreMatchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.controllers.UserController;
import com.revature.models.ClientInfo;
import com.revature.models.User;
import com.revature.services.JWTService;
import com.revature.services.UserService;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class UserControllerTest {
//	Initial test setup
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private UserService userServiceMock;
	
//	Object mapper to handle object to string conversion
	ObjectMapper objectMapper = new ObjectMapper();
	
	@Test
	public void registerUserTest() throws Exception {
//		Create fake user to be registered
		User fakeNewUser = new User(1, "new_user", "New", 
								    "User", "new-user@mail.com", "123456");
//		Define behavior for user repository method
		when(userServiceMock.registerUser(fakeNewUser)).thenReturn(true);
//		Manage user object conversion before registering
		String userAsString = objectMapper.writeValueAsString(fakeNewUser);
		JSONObject userJson = new JSONObject(userAsString);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.post("/register")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(userJson.toString()))
				.andExpect(status().isCreated())
				.andExpect(content().string(containsString("USER CREATED")));
	}
	
	@Test
	public void checkForUserTest() throws Exception {
//		Create new user
		User fakeUser = new User(1, "username", "First", 
								 "Last", "first-last@mail.com", "123456");
//		Define behavior for user service methods
		when(userServiceMock.userExists(fakeUser.getUsername())).thenReturn(false);
		when(userServiceMock.emailUsed(fakeUser.getEmail())).thenReturn(false);
//		Manage user object conversion before the test
		String userAsString = objectMapper.writeValueAsString(fakeUser);
		JSONObject userJson = new JSONObject(userAsString);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
						.post("/register/verifyUser")
						.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
						.content(userJson.toString()))
						.andExpect(status().isOk());
	}
	
	@Test
	public void checkPasswordTest() throws Exception {
//		Create fake user
		User fakeUser = new User(1, "username", "First", 
				 				 "Last", "first-last@mail.com", "123456");
//		Hash user password for the test
		String hashedPassword = BCrypt.hashpw(fakeUser.getPassword(), BCrypt.gensalt());
		fakeUser.setPassword(hashedPassword);
//		Generate JWT with user info for the test
		String fakeToken = JWTService.createJWT(String.valueOf(fakeUser.getId()), 
												fakeUser.getUsername(),
												fakeUser.getEmail(), 0);
//		Define behavior for user service method
		when(userServiceMock.checkPw(fakeUser.getUsername(), fakeUser.getPassword()))
			.thenReturn(true);
//		Manage user object conversion before the test
		String userAsString = objectMapper.writeValueAsString(fakeUser);
		JSONObject userJson = new JSONObject(userAsString);
//		Perform mvc test, with token in the authorization header
		mockMvc.perform(MockMvcRequestBuilders
				.post("/user/verifyPassword")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.header("Authorization", fakeToken)
				.content(userJson.toString()))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("PASSWORD CORRECT")));
	}
	
	@Test
	public void getUserTest() throws Exception {
//		Create new user and assign properties
		Optional<User> fakeUser = Optional.of(new User(1, "username", "First", 
				 								      "Last", "first-last@mail.com", "123456"));
//		Hash user password for the test
		String hashedPassword = BCrypt.hashpw(fakeUser.get().getPassword(), BCrypt.gensalt());
		fakeUser.get().setPassword(hashedPassword);
//		Generate JWT with user info for the test
		String fakeToken = JWTService.createJWT(String.valueOf(fakeUser.get().getId()), 
												fakeUser.get().getUsername(),
												fakeUser.get().getEmail(), 0);
//		Define behavior for user service method
		when(userServiceMock.getById(fakeUser.get().getId())).thenReturn(fakeUser);
//		Perform test with token in the authorization header
		mockMvc.perform(MockMvcRequestBuilders
				.get("/user/{id}",fakeUser.get().getId())
				.header("Authorization", fakeToken))
				.andExpect(status().isOk())
				.andExpect(content()
								.string(containsString("\"email\":\"first-last@mail.com\"")));
	}
	
	@Test
	public void userLoginTest() throws Exception {
//		Create user object
		User fakeUser = new User(1, "username", "First", 
								 "Last", "first-last@mail.com", "123456");
//		Hash user password for the test
		String hashedPassword = BCrypt.hashpw(fakeUser.getPassword(), BCrypt.gensalt());
		fakeUser.setPassword(hashedPassword);
//		Create ClientInfo object for the test
		ClientInfo userResponse = new ClientInfo(fakeUser.getId(), fakeUser.getUsername(), 
												 fakeUser.getFirstName(),fakeUser.getLastName(), 
												 fakeUser.getEmail(), "thisisafaketoken");
//		Define what the user service method should return
		when(userServiceMock.loginUser(fakeUser.getUsername(), fakeUser.getPassword()))
			.thenReturn(userResponse);
//		Manage user object conversion before the test
		String userAsString = objectMapper.writeValueAsString(fakeUser);
		JSONObject userJson = new JSONObject(userAsString);
//		Perform mvc test
		mockMvc.perform(MockMvcRequestBuilders
				.post("/login")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.content(userJson.toString()))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("\"token\":\"thisisafaketoken\"")));
	}
	
	@Test
	public void updateUserTest() throws Exception {
//		Create fake user
		User fakeUser = new User(1, "username", "First", 
				 				 "Last", "first-last@mail.com", "123456");
//		Hash user password for the test
		String hashedPassword = BCrypt.hashpw(fakeUser.getPassword(), BCrypt.gensalt());
		fakeUser.setPassword(hashedPassword);
//		Generate JWT with user info for the test
		String fakeToken = JWTService.createJWT(String.valueOf(fakeUser.getId()), 
												fakeUser.getUsername(),
												fakeUser.getEmail(), 0);
//		Manage user object conversion before the test
		String userAsString = objectMapper.writeValueAsString(fakeUser);
		JSONObject userJson = new JSONObject(userAsString);
//		Define what the user service method should return
		when(userServiceMock.updateUser(fakeUser)).thenReturn(true);
//		Perform test
		mockMvc.perform(MockMvcRequestBuilders
				.patch("/update")
				.contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.accept(MediaType.APPLICATION_JSON_UTF8_VALUE)
				.header("Authorization", fakeToken)
				.content(userJson.toString()))
				.andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("INFO UPDATED")));
	}
	
}
