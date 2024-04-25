import React, { useState } from 'react';
import './App.css'; // Import your CSS file

function TransactionHistory({ transactions, onEdit, onDelete }) {
  return (
    <div className="transaction-history">
      <h2>Monthly Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expense</th>
            <th>Savings</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(transactions).map(month => {
            const { totalIncome, savings, expenseTransactions } = transactions[month];
            return (
              <tr key={month}>
                <td>{month}</td>
                <td>{totalIncome}</td>
                <td className='expense-cell'>
                  {expenseTransactions.map((transaction, index) => (
                    <div key={index}>
                      {index + 1}. {transaction.description}: {transaction.amount}
                      <button className='edit-button' onClick={() => onEdit(month, index)}>Edit</button>
                      <button className="delete-button" onClick={() => onDelete(month, index)}>Delete</button>
                    </div>
                  ))}
                </td>
                <td>{savings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TransactionBox({ onAddTransaction }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [transactionType, setTransactionType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddTransaction = () => {
    if (selectedMonth && amount && (description || transactionType === 'income')) {
      const newTransaction = {
        month: selectedMonth,
        type: transactionType,
        amount: parseFloat(amount),
        description: description || 'Income'
      };
      onAddTransaction(newTransaction);
      setAmount('');
      setDescription('');
      setErrorMessage('');
    }
  };

  return (
    <div className="transaction-box">
      <label>Select Month:</label>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        <option value="">Select Month</option>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>

      <div className='type-labels'>
        <label>Type:</label>
        <input type="radio" id="income" name="transactionType" value="income" checked={transactionType === 'income'} onChange={() => {
          setTransactionType('income');
          setAmount('');
        }} />
        <label htmlFor="income">Income</label>
        <input type="radio" id="expense" name="transactionType" value="expense" checked={transactionType === 'expense'} onChange={() => {
          setTransactionType('expense');
          setAmount('');
        }} />
        <label htmlFor="expense">Expense</label>
      </div>

      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      {transactionType === 'expense' && (
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button onClick={handleAddTransaction}>Add</button>
    </div>
  );
}
function TotalSavingsBox({ transactions }) {
  const totalSavings = Object.values(transactions).reduce((total, { savings }) => total + savings, 0);
  
  return (
    <div className="total-savings-box">
      <h2>TOTAL SAVINGS</h2>
      <p>{totalSavings}</p>
    </div>
  );
}
export default function App() {
  const [transactions, setTransactions] = useState({});

  const handleAddTransaction = (newTransaction) => {
    const month = newTransaction.month;
    const updatedTransactions = {
      ...transactions,
      [month]: transactions[month]
        ? {
            ...transactions[month],
            expenseTransactions:
              newTransaction.type === 'expense'
                ? [...transactions[month].expenseTransactions, newTransaction]
                : transactions[month].expenseTransactions,
            totalIncome:
              newTransaction.type === 'income'
                ? transactions[month].totalIncome + newTransaction.amount
                : transactions[month].totalIncome,
            totalExpense:
              newTransaction.type === 'expense'
                ? transactions[month].totalExpense + newTransaction.amount
                : transactions[month].totalExpense,
            savings:
              newTransaction.type === 'income'
                ? transactions[month].savings + newTransaction.amount
                : transactions[month].savings - newTransaction.amount
          }
        : {
            expenseTransactions: newTransaction.type === 'expense' ? [newTransaction] : [],
            totalIncome: newTransaction.type === 'income' ? newTransaction.amount : 0,
            totalExpense: newTransaction.type === 'expense' ? newTransaction.amount : 0,
            savings: newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount
          }
    };
    setTransactions(updatedTransactions);
  };

  const handleEdit = (month, index) => {
  // Retrieve the transaction based on the month and index
  const transactionToEdit = transactions[month].expenseTransactions[index];
  
  // Example: Prompt the user to edit the transaction details
  const newAmount = prompt('Enter new amount:', transactionToEdit.amount);
  const newDescription = prompt('Enter new description:', transactionToEdit.description);

  // Update the transaction with the new details
  const updatedTransaction = {
    ...transactionToEdit,
    amount: parseFloat(newAmount),
    description: newDescription
  };

  // Call a function to update the transaction in the state
  updateTransaction(month, index, updatedTransaction);
};

const handleDelete = (month, index) => {
  // Retrieve the transaction based on the month and index
  const transactionToDelete = transactions[month].expenseTransactions[index];
  
  // Example: Confirm deletion with the user
  const confirmDelete = window.confirm(`Are you sure you want to delete the entry: ${transactionToDelete.description}?`);

  // If user confirms deletion, call a function to delete the transaction
  if (confirmDelete) {
    deleteTransaction(month, index);
  }
};

// Example functions to update and delete transactions in state
const updateTransaction = (month, index, updatedTransaction) => {
  const updatedTransactions = { ...transactions };
  updatedTransactions[month].expenseTransactions[index] = updatedTransaction;
  setTransactions(updatedTransactions);
};

const deleteTransaction = (month, index) => {
  const updatedTransactions = { ...transactions };
  updatedTransactions[month].expenseTransactions.splice(index, 1);
  setTransactions(updatedTransactions);
};

return (
  <div>
    <h1 className="app-heading">Expense Tracker</h1>
    <div className="app-container">
      <TransactionBox onAddTransaction={handleAddTransaction} />
      <TransactionHistory
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TotalSavingsBox transactions={transactions} />
    </div>
  </div>
);
}
