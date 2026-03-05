import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const COLORS = ['#38bdf8','#a78bfa','#34d399','#f59e0b','#f87171','#60a5fa','#fb923c','#e879f9'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background:'#111827',border:'1px solid rgba(56,189,248,0.2)',
        borderRadius:10,padding:'10px 14px',
        boxShadow:'0 8px 24px rgba(0,0,0,0.5)'
      }}>
        <p style={{margin:0,fontWeight:700,color:'var(--text-primary)',fontFamily:'Syne'}}>{payload[0].name}</p>
        <p style={{margin:'4px 0 0',color:'var(--accent-cyan)',fontWeight:600}}>₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
        <p style={{margin:'2px 0 0',color:'var(--text-secondary)',fontSize:'0.8rem'}}>{payload[0].payload.percent ? `${(payload[0].payload.percent * 100).toFixed(1)}%` : ''}</p>
      </div>
    );
  }
  return null;
};

function ExpenseChart({ chartData }) {
  if (chartData.length === 0) {
    return (
      <div className="fintech-card" style={{padding:24,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:180}}>
        <div style={{fontSize:36,marginBottom:10}}>📈</div>
        <p style={{color:'var(--text-muted)',fontSize:'0.875rem',margin:0}}>No data to display</p>
      </div>
    );
  }

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const dataWithPercent = chartData.map(d => ({ ...d, percent: d.value / total }));

  return (
    <div className="fintech-card fade-in" style={{padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <div style={{width:36,height:36,borderRadius:10,background:'rgba(167,139,250,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🍩</div>
        <div>
          <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)',margin:0}}>Breakdown</h3>
          <p style={{fontSize:'0.78rem',color:'var(--text-secondary)',margin:0}}>Expense distribution</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={dataWithPercent} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
            {dataWithPercent.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;
