export function generateStockRecommendation(stockData) {
  // FIX: changePercent arrives as a clean number now (backend strips the % sign)
  // But guard against it arriving as a string just in case
  const peRatio = Number(stockData.peRatio);
  const roe = Number(stockData.roe);
  const rawChange = stockData.changePercent;
  const changePercent = typeof rawChange === "string"
    ? parseFloat(rawChange.replace("%", "").trim())
    : Number(rawChange) || 0;

  let peScore = 0;
  let roeScore = 0;
  let momentumScore = 0;

  // ── Valuation (max 30 pts) ──────────────────────────────
  // Lower PE = better value. Negative PE = loss-making, give 0.
  if (!isNaN(peRatio) && peRatio > 0) {
    if (peRatio < 15)      peScore = 30;  // great value
    else if (peRatio < 25) peScore = 22;  // good value
    else if (peRatio < 35) peScore = 14;  // fair value
    else if (peRatio < 50) peScore = 7;   // expensive
    else                   peScore = 0;   // very expensive
  }

  // ── Profitability (max 30 pts) ──────────────────────────
  // ROE arrives as percentage points e.g. 18.23 (backend converts from decimal)
  if (!isNaN(roe) && roe > 0) {
    if (roe > 25)      roeScore = 30;  // exceptional
    else if (roe > 18) roeScore = 22;  // strong
    else if (roe > 12) roeScore = 14;  // decent
    else if (roe > 6)  roeScore = 7;   // below average
    else               roeScore = 2;
  }

  // ── Momentum (max 40 pts) ───────────────────────────────
  if      (changePercent > 4)   momentumScore = 40;
  else if (changePercent > 2)   momentumScore = 32;
  else if (changePercent > 0.5) momentumScore = 22;
  else if (changePercent > 0)   momentumScore = 14;
  else if (changePercent > -1)  momentumScore = 8;
  else if (changePercent > -3)  momentumScore = 3;
  else                          momentumScore = 0;

  const finalScore = Math.min(peScore + roeScore + momentumScore, 100);

  let recommendation;
  if      (finalScore >= 75) recommendation = "Strong Buy";
  else if (finalScore >= 58) recommendation = "Buy";
  else if (finalScore >= 40) recommendation = "Hold";
  else if (finalScore >= 22) recommendation = "Sell";
  else                       recommendation = "Strong Sell";

  const reasoning = generateReasoning({
    finalScore, peRatio, roe, changePercent, peScore, roeScore, momentumScore,
  });

  return {
    finalScore,
    recommendation,
    reasoning,
    breakdown: { peScore, roeScore, momentumScore },
  };
}

function generateReasoning({ finalScore, peRatio, roe, changePercent, peScore, roeScore, momentumScore }) {
  const parts = [];

  // Valuation comment
  if (peRatio > 0) {
    if (peScore >= 22)
      parts.push(`PE of ${peRatio.toFixed(1)} indicates attractive valuation`);
    else if (peScore >= 14)
      parts.push(`PE of ${peRatio.toFixed(1)} is fair but not cheap`);
    else
      parts.push(`PE of ${peRatio.toFixed(1)} suggests the stock is expensive`);
  } else {
    parts.push("PE data unavailable — valuation could not be assessed");
  }

  // Profitability comment
  if (roe > 0) {
    if (roeScore >= 22)
      parts.push(`strong ROE of ${roe.toFixed(1)}% reflects high profitability`);
    else if (roeScore >= 14)
      parts.push(`ROE of ${roe.toFixed(1)}% shows moderate profitability`);
    else
      parts.push(`ROE of ${roe.toFixed(1)}% is below average — profitability is weak`);
  } else {
    parts.push("ROE data unavailable from the API");
  }

  // Momentum comment
  if (changePercent > 2)
    parts.push(`strong positive momentum (+${changePercent.toFixed(2)}% today)`);
  else if (changePercent > 0)
    parts.push(`slight positive momentum (+${changePercent.toFixed(2)}% today)`);
  else if (changePercent > -2)
    parts.push(`mild negative pressure (${changePercent.toFixed(2)}% today)`);
  else
    parts.push(`significant negative momentum (${changePercent.toFixed(2)}% today)`);

  // Capitalise first letter and join
  const sentence = parts
    .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(", ");

  return `${sentence}. Overall score: ${finalScore}/100 — ${recommendation_label(finalScore)}.`;
}

function recommendation_label(score) {
  if (score >= 75) return "a compelling investment opportunity";
  if (score >= 58) return "a reasonable buy at current levels";
  if (score >= 40) return "hold and monitor closely";
  if (score >= 22) return "consider reducing exposure";
  return "avoid or exit the position";
}