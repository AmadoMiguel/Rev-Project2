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

@Entity
@Table(name = "income_types")
public class IncomeType {
//	Primary key
	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

//	Define the relationship between this table's primary key, and the
//	Budgets table foreign key (type)
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@JoinColumn(name = "income_type") // Define foreign key column
	private List<Income> Incomes = new ArrayList<Income>();

//	Type column
	@Column(name = "type")
	private String type;

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
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((Incomes == null) ? 0 : Incomes.hashCode());
		result = prime * result + id;
		result = prime * result + ((type == null) ? 0 : type.hashCode());
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
		IncomeType other = (IncomeType) obj;
		if (Incomes == null) {
			if (other.Incomes != null)
				return false;
		} else if (!Incomes.equals(other.Incomes))
			return false;
		if (id != other.id)
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "IncomeType [id=" + id + ", type=" + type + "]";
	}

	public IncomeType(int id, String type) {
		super();
		this.id = id;
		this.type = type;
	}

	public IncomeType() {
		super();
		// TODO Auto-generated constructor stub
	}

}	