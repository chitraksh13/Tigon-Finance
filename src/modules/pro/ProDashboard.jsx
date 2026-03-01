import { useState } from "react";
import StockSearch from "./StockSearch";
import { generateStockRecommendation } from "./ai/stockScoringEngine";

function ProDashboard({ income, totalExpenses }) {
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!symbol) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/stock/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Stock API error");
        return;
      }

      const stockData = {
        peRatio: data.peRatio,
        roe: data.roe,
        changePercent: data.changePercent,
      };

      const analysis = generateStockRecommendation(
        stockData,
        income,
        totalExpenses
      );

      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">
        AI Stock Insights
      </h2>

      <StockSearch
        symbol={symbol}
        setSymbol={setSymbol}
      />

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        {loading ? "Analyzing..." : "Analyze Stock"}
      </button>

      {result && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">
            AI Score: {result.finalScore}/100
          </h3>

          <p className="mb-2">
            Recommendation:{" "}
            <span className="font-bold">
              {result.recommendation}
            </span>
          </p>

          <p className="text-gray-600 text-sm mt-2">
            {result.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProDashboard;