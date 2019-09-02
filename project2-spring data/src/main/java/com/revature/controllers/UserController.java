package com.revature.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.models.ClientInfo;
import com.revature.models.User;
import com.revature.services.JWTService;
import com.revature.services.UserServices;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.PATCH })
public class UserController {

	UserServices userService;

	@Autowired
	public UserController(UserServices userService) {
		super();
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<Object> userRegister(@RequestBody User userForm) {
		userService.registerUser(userForm);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/register/verifyUser")
	public ResponseEntity<Object> checkForUser(@RequestBody User user) {
		if (userService.userExists(user.getUsername()))
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		if (userService.emailUsed(user.getEmail()))
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/user/verifyPassword")
	public ResponseEntity<Object> checkPw(@RequestHeader("Authorization") String token, @RequestBody User user) {
		if (!JWTService.checkAuthByUsername(token, user.getUsername()))
			return new ResponseEntity<>("You are not authorized for this operation!", HttpStatus.UNAUTHORIZED);
		if (userService.checkPw(user.getUsername(), user.getPassword()))
			return new ResponseEntity<>(HttpStatus.OK);
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<Object> getUser(@RequestHeader("Authorization") String token, @PathVariable("id") int id) {
		if (!JWTService.checkAuthByID(token, id))
			return new ResponseEntity<>("You are not authorized for this operation!", HttpStatus.UNAUTHORIZED);

		return new ResponseEntity<>(userService.getById(id), HttpStatus.OK);
	}

	@CrossOrigin
	@PostMapping("/login")
	public ResponseEntity<Object> userLogin(@RequestBody User user) {
		ClientInfo token = userService.loginUser(user.getUsername(), user.getPassword());
		if (token == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		return new ResponseEntity<>(token, HttpStatus.OK);

	}

	@PatchMapping("/update")
	public ResponseEntity<Object> updateUser(@RequestHeader("Authorization") String token, @RequestBody User user) {
		if (!JWTService.checkAuthByID(token, user.getId()))
			return new ResponseEntity<>("You are not authorized for this operation!", HttpStatus.UNAUTHORIZED);
		return userService.updateUser(user) ? new ResponseEntity<>(HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.BAD_REQUEST);

	}

}
