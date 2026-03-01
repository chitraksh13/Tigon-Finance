export function generateStockRecommendation(stockData, income, totalExpenses) {
  const peRatio = Number(stockData.peRatio);
  const roe = Number(stockData.roe);
  const changePercent = parseFloat(stockData.changePercent) || 0;

  let score = 0;

  // ---------------- Valuation (30) ----------------
  if (!isNaN(peRatio) && peRatio > 0) {
    if (peRatio < 20) score += 30;
    else if (peRatio < 30) score += 20;
    else if (peRatio < 50) score += 10;
  }

  // ---------------- Profitability (30) ----------------
  if (!isNaN(roe) && roe > 0) {
    if (roe > 20) score += 30;
    else if (roe > 15) score += 20;
    else if (roe > 10) score += 10;
  }

  // ---------------- Momentum (40) ----------------
  if (changePercent > 3) score += 40;
  else if (changePercent > 1) score += 30;
  else if (changePercent > 0) score += 20;
  else if (changePercent > -2) score += 10;
  else score += 0;

  const finalScore = Math.min(score, 100);

  let recommendation = "Hold";

  if (finalScore >= 75) recommendation = "Strong Buy";
  else if (finalScore >= 60) recommendation = "Buy";
  else if (finalScore >= 40) recommendation = "Hold";
  else if (finalScore >= 25) recommendation = "Sell";
  else recommendation = "Strong Sell";

  return {
    finalScore,
    recommendation,
    reasoning: generateReasoning(finalScore, changePercent),
  };
}

function generateReasoning(score, changePercent) {
  if (score >= 75)
    return "Strong financial metrics and positive market momentum.";
  if (score >= 60)
    return "Good financial health with moderate market strength.";
  if (score >= 40)
    return "Mixed signals detected. Consider monitoring closely.";
  if (changePercent < 0)
    return "Negative price movement indicates short-term weakness.";
  return "Weak financial and momentum indicators.";
}