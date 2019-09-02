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
@Table(name = "incomes")
public class Income {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id")
	private int userId;
	
	@ManyToOne
	@JoinColumn(name = "income_type")
	private IncomeType incomeType;

	private String description;
	private int amount;
	public Income() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Income(int id, int userId, IncomeType incomeType, String description, int amount) {
		super();
		this.id = id;
		this.userId = userId;
		this.incomeType = incomeType;
		this.description = description;
		this.amount = amount;
	}
	@Override
	public String toString() {
		return "Income [id=" + id + ", userId=" + userId + ", incomeType=" + incomeType + ", description=" + description
				+ ", amount=" + amount + "]";
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + amount;
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + id;
		result = prime * result + ((incomeType == null) ? 0 : incomeType.hashCode());
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
		Income other = (Income) obj;
		if (amount != other.amount)
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id != other.id)
			return false;
		if (incomeType == null) {
			if (other.incomeType != null)
				return false;
		} else if (!incomeType.equals(other.incomeType))
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
	public IncomeType getIncomeType() {
		return incomeType;
	}
	public void setIncomeType(IncomeType incomeType) {
		this.incomeType = incomeType;
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
	
	

}
