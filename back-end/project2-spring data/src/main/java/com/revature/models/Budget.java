package com.revature.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "budgets")
public class Budget {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id")
	private int userId;

	private String description;
	private int amount;

	@ManyToOne
	@JoinColumn(name = "budget_type")
	private BudgetType budgetType;

	public Budget() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Budget(int id, int userId, String description, int amount, BudgetType budgetType) {
		super();
		this.id = id;
		this.userId = userId;
		this.description = description;
		this.amount = amount;
		this.budgetType = budgetType;
	}

	@Override
	public String toString() {
		return "Budget [id=" + id + ", userId=" + userId + ", description=" + description + ", amount=" + amount
				+ ", budgetType=" + budgetType + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + amount;
		result = prime * result + ((budgetType == null) ? 0 : budgetType.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + id;
		result = prime * result + userId;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Budget other = (Budget) obj;
		if (amount != other.amount)
			return false;
		if (budgetType == null) {
			if (other.budgetType != null)
				return false;
		} else if (!budgetType.equals(other.budgetType))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id != other.id)
			return false;
		if (userId != other.userId)
			return false;
		return true;
	}

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public BudgetType getBudgetType() {
		return budgetType;
	}

	public void setBudgetType(BudgetType budgetType) {
		this.budgetType = budgetType;
	}

}
