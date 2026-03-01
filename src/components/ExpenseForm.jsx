function ExpenseForm({
  expenseAmount,
  setExpenseAmount,
  expenseCategory,
  setExpenseCategory,
  onAdd,
  amountError,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

      <h3 className="text-lg font-semibold text-gray-700 mb-3">
  Add Expense
</h3>


<input
  type="number"
  value={expenseAmount}
  placeholder="Enter Amount"
  onChange={(e) => setExpenseAmount(e.target.value)}
  className={`border rounded p-2 w-full ${
  amountError ? "shake border-red-500" : ""
  }`}
/>


      <br /><br />

      <input
  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
  type="text"
  value={expenseCategory}
  placeholder="Enter Category"
  onChange={(e) => setExpenseCategory(e.target.value)}
/>


      <br /><br />

 <button
  onClick={onAdd}
  disabled={Number(expenseAmount) <= 0}
  className={`px-4 py-2 rounded-lg text-white transition ${
    Number(expenseAmount) <= 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  Add Expense
</button>

    </div>
  );
}

export default ExpenseForm;
