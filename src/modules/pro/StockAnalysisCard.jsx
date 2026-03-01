function StockAnalysisCard() {
  return (
    <div className="border p-4 rounded mb-6">
      <h3 className="font-semibold mb-2">
        Fundamental + Technical Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>PE Ratio: --</p>
          <p>EPS: --</p>
          <p>Revenue Growth: --</p>
        </div>

        <div>
          <p>RSI: --</p>
          <p>MACD: --</p>
          <p>Moving Average: --</p>
        </div>
      </div>
    </div>
  );
}

export default StockAnalysisCard;
