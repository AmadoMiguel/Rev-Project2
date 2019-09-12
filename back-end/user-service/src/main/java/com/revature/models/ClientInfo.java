package com.revature.models;

public class ClientInfo {
	private int id;
	private String username;
	private String firstName;
	private String lastName;
	private String email;
	private String token;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	@Override
	public String toString() {
		return "ClientInfo [id=" + id + ", username=" + username + ", firstName=" + firstName + ", lastName=" + lastName + ", email="
				+ email + ", token=" + token + "]";
	}

	public ClientInfo(int id, String username, String firstName, String lastName, String email, String token) {
		super();
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.token = token;
	}

	public ClientInfo() {
		super();
	}

}
