package com.revature.models;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.revature.dto.UserDto;

@Entity
@Table(name = "expenses")
public class Expense {

//	Primary key
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id")
	private int userId;

	@Transient
	private UserDto user;
	
//	Define many-to-one relationship between expenses and expense-types tables
	@ManyToOne
	@JoinColumn(name = "type_id")
	private ExpenseType expenseType;

//	Other fields
	@DateTimeFormat(iso = ISO.DATE)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	LocalDate date;
	
	@Column(name = "description")
	private String description;

	@Column(name = "amount")
	private double amount;

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
	
	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}

	public ExpenseType getExpenseType() {
		return expenseType;
	}

	public void setExpenseType(ExpenseType expenseType) {
		this.expenseType = expenseType;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public Expense(int id, int userId, ExpenseType expenseType, LocalDate date, String description, double amount) {
		super();
		this.id = id;
		this.userId = userId;
		this.expenseType = expenseType;
		this.date = date;
		this.description = description;
		this.amount = amount;
	}

	public Expense() {
		super();
	}

	@Override
	public String toString() {
		return "Expense [id=" + id + ", userId=" + userId + ", user=" + user + ", expenseType=" + expenseType
				+ ", date=" + date + ", description=" + description + ", amount=" + amount + "]";
	}
	
	
}
