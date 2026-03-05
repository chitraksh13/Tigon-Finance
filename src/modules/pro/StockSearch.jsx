function StockSearch({ symbol, setSymbol }) {
  return (
    <div>
      <label style={{display:'block',fontSize:'0.75rem',fontWeight:600,color:'var(--text-secondary)',marginBottom:7,textTransform:'uppercase',letterSpacing:'0.05em'}}>
        Indian Stock Symbol
      </label>
      <input
        type="text"
        placeholder="e.g. RELIANCE, TCS, INFY"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        className="fintech-input"
        style={{fontWeight: 600, letterSpacing: '0.04em'}}
      />
    </div>
  );
}

export default StockSearch;
