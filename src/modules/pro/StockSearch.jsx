function StockSearch({ symbol, setSymbol }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">
        Search Indian Stock
      </h3>

      <input
        type="text"
        placeholder="e.g. RELIANCE"
        value={symbol}
        onChange={(e) =>
          setSymbol(e.target.value.toUpperCase())
        }
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

export default StockSearch;
