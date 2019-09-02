package com.revature.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "expenses")
public class Expense {

//	Primary key
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

//	Define many-to-one relationship between expenses and users tables
//	@ManyToOne
//	@JoinColumn(name="user_id")
//	private User user;

	@Column(name = "user_id")
	private int userId;

//	Define many-to-one relationship between expenses and expense-types tables
	@ManyToOne
	@JoinColumn(name = "type_id")
	private ExpenseType expenseType;

//	Other fields
	@Temporal(TemporalType.DATE)
	Date date;

	@Override
	public String toString() {
		return "Expense [id=" + id + ", userId=" + userId + ", expenseType=" + expenseType + ", date=" + date
				+ ", description=" + description + ", amount=" + amount + "]";
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	@Column(name = "description")
	private String description;

	@Column(name = "amount")
	private double amount;

//	Auto generated...
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public ExpenseType getExpenseType() {
		return expenseType;
	}

	public void setExpenseType(ExpenseType expenseType) {
		this.expenseType = expenseType;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
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

	public Expense(int id, int userId, ExpenseType expenseType, Date date, String description, double amount) {
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
}
