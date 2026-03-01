function InsightsPanel({ insights }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
  Smart Insights
</h3>


      {insights.length === 0 ? (
        <p className="text-gray-500 text-sm">No insights available yet.</p>
      ) : (
        <ul>
          {insights.map((msg, index) => (
            <li className="text-grey-600" key={index}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InsightsPanel;
