export interface DocumentChunk {
  id: string;
  metadata: {
    category: string;
    source: string;
  };
  text: string;
}

export const bookChunks: DocumentChunk[] = [
  {
    id: "chunk_001_debt",
    metadata: { category: "Debt", source: "Discover The Wealth Within You - Chapter 4" },
    text: "Credit card debt is the single most destructive force in personal finance. Because of compounding interest, a ₹50,000 balance at 19% interest will cost you thousands in interest and take years to pay off if you only make the minimum payment. The absolute first priority for any wealth-building plan is to aggressively pay down high-interest debt, because no investment will reliably return more than what the credit card company is charging you."
  },
  {
    id: "chunk_002_emergency",
    metadata: { category: "Emergency Fund", source: "Discover The Wealth Within You - Chapter 5" },
    text: "An emergency fund is not an investment; it is insurance. You must keep three to six months of living expenses in a highly liquid, safe account like a high-yield savings account or a money market fund. Do not chase yield here. Without a cash cushion, any unexpected expense—a car repair, a medical bill, or a job loss—will force you to rely on credit cards or raid your retirement accounts, resulting in taxes and penalties."
  },
  {
    id: "chunk_003_retirement_longevity",
    metadata: { category: "Retirement", source: "Discover The Wealth Within You - Chapter 8" },
    text: "The greatest risk to retirees today is not market volatility; it is longevity risk. Medical advancements mean that if you make it to 65, there is a very high probability you will live to 90, 95, or even 100. Your retirement capital must be invested for growth even after you retire to combat decades of inflation, otherwise you risk outliving your money."
  },
  {
    id: "chunk_004_retirement_withdrawals",
    metadata: { category: "Retirement", source: "Discover The Wealth Within You - Chapter 9" },
    text: "When you begin withdrawing money in retirement, the sequence matters immensely for tax efficiency. You should generally tap your taxable brokerage accounts first, allowing your tax-deferred accounts (like a Traditional IRA or 401k) and tax-free accounts (like a Roth IRA) to continue compounding for as long as possible. This strategy minimizes tax drag and maximizes the longevity of your portfolio."
  },
  {
    id: "chunk_005_goals",
    metadata: { category: "Goals", source: "Discover The Wealth Within You - Chapter 3" },
    text: "When facing a shortfall for a financial goal, people often make the mistake of taking on more investment risk to 'catch up.' This is a recipe for disaster. You cannot wish for higher returns. Instead, you have only three mathematical levers you can control: you must increase your monthly savings rate, reduce the total cost or expectations of the goal, or delay the timeline to give your money more time to compound."
  },
  {
    id: "chunk_006_allocation",
    metadata: { category: "Asset Allocation", source: "Discover The Wealth Within You - Chapter 11" },
    text: "Asset allocation drift occurs when certain investments grow faster than others, throwing your portfolio out of its intended risk profile. If your target is 60% stocks and 40% bonds, a bull market might push you to 75% stocks, exposing you to significantly more risk than you planned. You must systematically rebalance back to your target allocation to lock in gains and buy underperforming assets low."
  }
];
