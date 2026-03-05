function InsightsPanel({ insights }) {
  const icons = ['💡','📉','⚠️','✅','🎯','📊'];

  return (
    <div className="fintech-card fade-in" style={{padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <div style={{width:36,height:36,borderRadius:10,background:'rgba(251,191,36,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🧠</div>
        <div>
          <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)',margin:0}}>Smart Insights</h3>
          <p style={{fontSize:'0.78rem',color:'var(--text-secondary)',margin:0}}>AI-powered analysis</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div style={{
          textAlign:'center',padding:'24px 16px',
          border:'1px dashed var(--border)',borderRadius:12,
          color:'var(--text-muted)'
        }}>
          <p style={{margin:0,fontSize:'0.875rem'}}>Add expenses to see insights</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {insights.map((msg, index) => (
            <div key={index} style={{
              display:'flex',alignItems:'flex-start',gap:10,
              padding:'10px 12px',
              background:'rgba(251,191,36,0.05)',
              border:'1px solid rgba(251,191,36,0.1)',
              borderRadius:10
            }}>
              <span style={{fontSize:14,marginTop:1}}>{icons[index % icons.length]}</span>
              <p style={{margin:0,fontSize:'0.8375rem',color:'var(--text-secondary)',lineHeight:1.5}}>{msg}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;
