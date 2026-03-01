export function generateInsights(categoryTotals) {
    const insights = [];
    const total = Object.values(categoryTotals)
    .reduce ((sum, val) => sum + val, 0);

    if (total === 0) return insights;
    Object.entries(categoryTotals).forEach(([category, amount]) => {
        const percentage = (amount / total) * 100;
        if (percentage > 40){
            insights.push(`⚠️ ${category} accounts for ${percentage.toFixed(1)}% of your spending`);
        }

    });
    if( total > 1000){
        insights.push("🚨 High spending alert! Review your expenses.");
    }
    if (total < 6000){
        insights.push("✅ Great job! You stayed within a healthy budget.");
    }
    return insights;
}