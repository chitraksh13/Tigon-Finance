function IncomeInput({ income, setIncome, onSave }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
  Income
</h3>

      <input
  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
  type="number"
  value={income}
  onChange={(e) => setIncome(Number(e.target.value))}
/>
<button
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mt-3"
  onClick={() => onSave()}
>
  Save Income
</button>

    </div>
  );
}

export default IncomeInput;
