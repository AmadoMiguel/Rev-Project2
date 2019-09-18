package com.revature.services;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.revature.models.ClientInfo;
import com.revature.models.User;
import com.revature.repositories.UserRepository;

@Service
public class UserService {
	UserRepository<User> userRepository;

	@Autowired
	public UserService(UserRepository<User> userRepository) {
		super();
		this.userRepository = userRepository;
	}

	public boolean checkPw(String un, String pw) {
		Optional<User> user = userRepository.findByUsername(un);
		if (BCrypt.checkpw(pw, user.get().getPassword()))
			return true;
		return false;
	}

	public ClientInfo loginUser(String un, String pw) {
		Optional<User> user = userRepository.findByUsername(un);
		if (user.isPresent()) {
			if (BCrypt.checkpw(pw, user.get().getPassword())) {
				ClientInfo clientInfo = new ClientInfo(user.get().getId(), user.get().getUsername(),
						user.get().getFirstName(), user.get().getLastName(), user.get().getEmail(),
						JWTService.createJWT(String.valueOf(user.get().getId()), user.get().getUsername(),
								user.get().getEmail(), 0));
//				Rest template used to send the token to the expense service
//				RestTemplate restTemplate = new RestTemplate();
//				String uri = "http://localhost:8765/expense-service/expense/user/{userId}/token/{token}";
////				Organize url parameters
//				Map<String,String> uriParams = new HashMap<String,String>();
//				uriParams.put("userId", String.valueOf(clientInfo.getId()));
//				uriParams.put("token", clientInfo.getToken());
//				UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(uri);
//				restTemplate.exchange(uriBuilder.buildAndExpand(uriParams).toUri(),
//									  HttpMethod.PUT, null, String.class);
				return clientInfo;
			} else
				return null;
		}
		return null;
	}

	public boolean userExists(String un) {
		Optional<User> user = userRepository.findByUsername(un);
		if (user.isPresent()) {
			return true;
		}

		return false;

	}

	public boolean emailUsed(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		if (user.isPresent()) {
			return true;
		}

		return false;
	}

	public boolean registerUser(User user) {
		String pw = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
		user.setPassword(pw);
		return userRepository.save(user) != null;
	}

	public boolean updateUser(User user) {
		Optional<User> oldUser = getById(user.getId());
		if (user.getFirstName() == null)
			user.setFirstName(oldUser.get().getFirstName());
		if (user.getLastName() == null)
			user.setLastName(oldUser.get().getLastName());
		if (user.getEmail() == null)
			user.setEmail(oldUser.get().getEmail());
		if (user.getUsername() == null)
			user.setUsername(oldUser.get().getUsername());
		if (user.getPassword() != null) {
			String pw = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
			user.setPassword(pw);
		} else
			user.setPassword(oldUser.get().getPassword());

		return userRepository.save(user) != null;
	}

	public Optional<User> getById(int id) {
		return userRepository.findById(id);
	}

}
