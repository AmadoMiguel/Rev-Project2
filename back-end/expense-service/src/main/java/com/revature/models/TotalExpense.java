package com.revature.models;

public class TotalExpense {

	public String month;
	public double total;

	public TotalExpense(String month, double total) {
		super();
		this.month = month;
		this.total = total;
	}

	@Override
	public String toString() {
		return "TotalExpense [month=" + month + ", total=" + total + "]";
	}

}
