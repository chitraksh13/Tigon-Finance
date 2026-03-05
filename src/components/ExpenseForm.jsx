function ExpenseForm({ expenseAmount, setExpenseAmount, expenseCategory, setExpenseCategory, onAdd, amountError }) {
  const categories = ['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Education', 'Other'];

  return (
    <div className="fintech-card fade-in" style={{padding: 24}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <div style={{
          width:36,height:36,borderRadius:10,
          background:'rgba(248,113,113,0.1)',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:16
        }}>📊</div>
        <div>
          <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)',margin:0}}>Add Expense</h3>
          <p style={{fontSize:'0.78rem',color:'var(--text-secondary)',margin:0}}>Track a new expense</p>
        </div>
      </div>

      <div style={{marginBottom:14}}>
        <label style={{display:'block',fontSize:'0.75rem',fontWeight:600,color:'var(--text-secondary)',marginBottom:7,textTransform:'uppercase',letterSpacing:'0.05em'}}>Amount</label>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-secondary)',fontWeight:600,pointerEvents:'none'}}>₹</span>
          <input
            type="number"
            value={expenseAmount}
            placeholder="0"
            onChange={(e) => setExpenseAmount(e.target.value)}
            className={`fintech-input ${amountError ? 'shake' : ''}`}
            style={{paddingLeft:30}}
          />
        </div>
      </div>

      <div style={{marginBottom:16}}>
        <label style={{display:'block',fontSize:'0.75rem',fontWeight:600,color:'var(--text-secondary)',marginBottom:7,textTransform:'uppercase',letterSpacing:'0.05em'}}>Category</label>
        <input
          className="fintech-input"
          type="text"
          value={expenseCategory}
          placeholder="e.g. Food, Transport..."
          onChange={(e) => setExpenseCategory(e.target.value)}
          list="category-suggestions"
        />
        <datalist id="category-suggestions">
          {categories.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      <button
        onClick={onAdd}
        disabled={Number(expenseAmount) <= 0}
        className="btn-primary"
        style={{width:'100%'}}
      >
        + Add Expense
      </button>
    </div>
  );
}

export default ExpenseForm;
