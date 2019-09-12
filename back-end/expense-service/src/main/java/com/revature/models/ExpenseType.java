package com.revature.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name="expense_types")
public class ExpenseType {
//	Primary key
	@Id
	private int id;
//	Define the relationship between this table's primary key, and the
//	expenses table foreign key (type)
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@JoinColumn(name = "type_id") // Define foreign key column
	@JsonIgnore
	private List<Expense> expenses = new ArrayList<Expense>();
//	Type column
	@Column(name="type")
	private String type;
//	Auto generated...
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "ExpenseType [id=" + id + ", type=" + type + "]";
	}
	public ExpenseType(int id, String type) {
		super();
		this.id = id;
		this.type = type;
	}
	public ExpenseType() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}