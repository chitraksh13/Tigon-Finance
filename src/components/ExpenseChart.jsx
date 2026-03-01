import { PieChart, Pie, Tooltip, Legend } from "recharts";

function ExpenseChart({ chartData }) {
  if (chartData.length === 0) {
    return <p className="text-gray-500 text-sm">No data to display.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
  Expense Distribution
</h3>

      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default ExpenseChart;
