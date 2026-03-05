import { useState } from "react";
import StockSearch from "./StockSearch";
import { generateStockRecommendation } from "./ai/stockScoringEngine";

function ScoreMeter({ score }) {
  const color = score >= 70 ? 'var(--accent-green)' : score >= 45 ? 'var(--accent-amber)' : 'var(--accent-red)';
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <span style={{fontSize:'0.8125rem',fontWeight:600,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.05em'}}>AI Score</span>
        <span style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.5rem',color}}>{score}<span style={{fontSize:'0.875rem',color:'var(--text-muted)'}}>/100</span></span>
      </div>
      <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${score}%`,background:color,borderRadius:3,transition:'width 0.6s ease',boxShadow:`0 0 8px ${color}40`}} />
      </div>
    </div>
  );
}

function ProDashboard({ income, totalExpenses }) {
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!symbol) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/stock/${symbol}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Stock API error"); return; }
      const analysis = generateStockRecommendation({ peRatio: data.peRatio, roe: data.roe, changePercent: data.changePercent }, income, totalExpenses);
      setResult(analysis);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const recColor = result?.recommendation === 'BUY' ? 'var(--accent-green)' : result?.recommendation === 'SELL' ? 'var(--accent-red)' : 'var(--accent-amber)';

  return (
    <div className="fintech-card fade-in" style={{padding:28,marginTop:20}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <div style={{
          width:42,height:42,borderRadius:12,
          background:'linear-gradient(135deg,rgba(56,189,248,0.2),rgba(99,102,241,0.2))',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:20
        }}>🤖</div>
        <div>
          <h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.25rem',color:'var(--text-primary)',margin:0}}>AI Stock Insights</h2>
          <p style={{fontSize:'0.8125rem',color:'var(--text-secondary)',margin:0}}>Pro feature — AI-powered stock analysis</p>
        </div>
        <span style={{
          marginLeft:'auto',padding:'3px 10px',
          background:'linear-gradient(135deg,rgba(56,189,248,0.15),rgba(99,102,241,0.15))',
          border:'1px solid rgba(56,189,248,0.2)',borderRadius:6,
          fontSize:'0.7rem',fontWeight:700,color:'var(--accent-cyan)',textTransform:'uppercase',letterSpacing:'0.08em'
        }}>PRO</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,marginBottom:24,alignItems:'end'}}>
        <StockSearch symbol={symbol} setSymbol={setSymbol} />
        <button
          onClick={handleAnalyze}
          disabled={!symbol || loading}
          className="btn-primary"
          style={{height:46,whiteSpace:'nowrap',padding:'0 24px'}}
        >
          {loading ? "Analyzing..." : "Analyze →"}
        </button>
      </div>

      {result && (
        <div className="fade-in" style={{
          background:'rgba(255,255,255,0.025)',
          border:'1px solid rgba(56,189,248,0.12)',
          borderRadius:14,padding:20
        }}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1.125rem',color:'var(--text-primary)',margin:0}}>{symbol}</h3>
            <span style={{
              padding:'5px 14px',borderRadius:8,
              background:`${recColor}18`,
              border:`1px solid ${recColor}35`,
              color:recColor,fontWeight:800,fontSize:'0.9rem',
              fontFamily:'Syne',letterSpacing:'0.05em'
            }}>{result.recommendation}</span>
          </div>
          <ScoreMeter score={result.finalScore} />
          <p style={{margin:0,fontSize:'0.875rem',color:'var(--text-secondary)',lineHeight:1.6,background:'rgba(255,255,255,0.02)',padding:'12px 14px',borderRadius:10,border:'1px solid var(--border)'}}>{result.reasoning}</p>
        </div>
      )}
    </div>
  );
}

export default ProDashboard;
