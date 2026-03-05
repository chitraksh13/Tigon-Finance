const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#38bdf8', Housing: '#a78bfa',
  Health: '#34d399', Entertainment: '#f87171', Shopping: '#fb923c',
  Education: '#60a5fa', Other: '#8899b4'
};

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || '#8899b4';
}

function ExpenseList({
  expenses, editingId, setEditingId, editAmount, setEditAmount,
  editCategory, setEditCategory, onSaveEdit, onDelete, editAmountError
}) {
  return (
    <div className="fintech-card fade-in" style={{padding: 24}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:'rgba(56,189,248,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>📋</div>
          <div>
            <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)',margin:0}}>Expenses</h3>
            <p style={{fontSize:'0.78rem',color:'var(--text-secondary)',margin:0}}>{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div style={{
          textAlign:'center',padding:'36px 20px',
          border:'1px dashed var(--border)',borderRadius:12,
          color:'var(--text-muted)'
        }}>
          <div style={{fontSize:32,marginBottom:10}}>💸</div>
          <p style={{margin:0,fontSize:'0.9rem'}}>No expenses yet this month</p>
          <p style={{margin:'4px 0 0',fontSize:'0.8rem',color:'var(--text-muted)'}}>Add your first expense above</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflowY:'auto',paddingRight:4}}>
          {expenses.map((exp) => {
            const color = getCategoryColor(exp.category);
            return (
              <div key={exp.id} style={{
                background:'rgba(255,255,255,0.025)',border:'1px solid var(--border)',
                borderRadius:12,padding:'12px 14px',
                transition:'border-color 0.2s,background 0.2s',
                borderLeft:`3px solid ${color}`
              }}>
                {editingId === exp.id ? (
                  <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                    <input
                      className="fintech-input"
                      style={{flex:1,minWidth:100,padding:'8px 12px',fontSize:'0.875rem'}}
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Category"
                    />
                    <div style={{position:'relative',flex:1,minWidth:90}}>
                      <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-secondary)',fontSize:'0.875rem'}}>₹</span>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className={`fintech-input ${editAmountError ? 'shake' : ''}`}
                        style={{paddingLeft:24,padding:'8px 8px 8px 24px',fontSize:'0.875rem'}}
                      />
                    </div>
                    <button className="btn-save" disabled={Number(editAmount) <= 0} onClick={() => onSaveEdit(exp.id)}>Save</button>
                    <button className="btn-secondary" style={{padding:'7px 12px',fontSize:'0.8rem'}} onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div>
                        <span style={{fontSize:'0.875rem',fontWeight:600,color:'var(--text-primary)'}}>{exp.category || 'Uncategorized'}</span>
                        <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:1}}>expense</div>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--accent-red)'}}>
                        −₹{Number(exp.amount).toLocaleString('en-IN')}
                      </span>
                      <button className="btn-edit" onClick={() => { setEditingId(exp.id); setEditAmount(exp.amount); setEditCategory(exp.category); }}>Edit</button>
                      <button className="btn-danger" onClick={() => { if (window.confirm("Delete this expense?")) onDelete(exp.id); }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
