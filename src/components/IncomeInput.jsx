function IncomeInput({ income, setIncome, onSave }) {
  return (
    <div className="fintech-card fade-in" style={{padding: 24}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <div style={{
          width:36,height:36,borderRadius:10,
          background:'rgba(52,211,153,0.12)',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:16
        }}>💰</div>
        <div>
          <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)',margin:0}}>Monthly Income</h3>
          <p style={{fontSize:'0.78rem',color:'var(--text-secondary)',margin:0}}>Set your income for this period</p>
        </div>
      </div>

      <div style={{position:'relative',marginBottom:16}}>
        <span style={{
          position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',
          color:'var(--text-secondary)',fontWeight:600,fontSize:'1rem',pointerEvents:'none'
        }}>₹</span>
        <input
          className="fintech-input"
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          style={{paddingLeft: 30}}
          placeholder="0"
        />
      </div>

      <button className="btn-primary" onClick={onSave} style={{width:'100%'}}>
        Save Income
      </button>
    </div>
  );
}

export default IncomeInput;
