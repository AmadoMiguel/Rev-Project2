package com.revature.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

// Class used to store the current logged in user in order to be able to retrieve user info
// and send it in the expenses payload
@Entity
@Table(name="user_token")
public class TokenDto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name="user_id")
	private int userId;
	
	@Column(name="user_token")
	private String currentUserToken;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getCurrentUserToken() {
		return currentUserToken;
	}

	public void setCurrentUserToken(String currentUserToken) {
		this.currentUserToken = currentUserToken;
	}

	public TokenDto(int id, int userId, String currentUserToken) {
		super();
		this.id = id;
		this.userId = userId;
		this.currentUserToken = currentUserToken;
	}

	public TokenDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "TokenDto [id=" + id + ", userId=" + userId + ", currentUserToken=" + currentUserToken + "]";
	}
	
}
