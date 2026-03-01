function ExpenseList({
  expenses,
  editingId,
  setEditingId,
  editAmount,
  setEditAmount,
  editCategory,
  setEditCategory,
  onSaveEdit,
  onDelete,
  editAmountError,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Expenses List
      </h3>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-sm">No expenses added yet.</p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="flex justify-between items-center"
            >
              {editingId === exp.id ? (
                <div className="flex gap-2 w-full">
                  <input
                    className="border p-1 rounded w-1/3"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  />
                  <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className={`border p-1 rounded ${
                    editAmountError ? "shake border-red-500" : ""
                  }`}
                />

                  <button
  onClick={() => onSaveEdit(exp.id)}
  disabled={Number(editAmount) <= 0}
  className={`font-semibold ${
    Number(editAmount) <= 0
      ? "text-gray-400 cursor-not-allowed"
      : "text-green-600"
  }`}
>
  Save
</button>

                  <button
                    className="text-gray-500"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-600">
                    {exp.category}: ₹{exp.amount}
                  </span>
                  <div className="flex gap-3">
  <button
    className="text-blue-600"
    onClick={() => {
      setEditingId(exp.id);
      setEditAmount(exp.amount);
      setEditCategory(exp.category);
    }}
    title="Edit expense"
  >
    ✏️
  </button>

  <button
    className="text-red-600"
    onClick={() => {
      if (window.confirm("Delete this expense?")) {
        onDelete(exp.id);
      }
    }}
    title="Delete expense"
  >
    🗑️
  </button>
</div>

                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;
