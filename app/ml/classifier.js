const CATEGORY_RULES = {
  Food: ["food", "pizza", "burger", "restaurant", "lunch", "dinner", "snack", "groceries"],
  Travel: ["travel", "uber", "taxi", "flight", "bus", "metro", "train", "fuel", "petrol"],
  Bills: ["bill", "electricity", "water", "internet", "rent", "recharge", "emi"],
  Shopping: ["shopping", "amazon", "flipkart", "mall", "shirt", "clothes", "shoes", "gadget"],
};

function normalize(text) {
  return String(text || "").trim().toLowerCase();
}

function predictCategory(description) {
  const text = normalize(description);
  if (!text) return "Others";

  let bestCategory = "Others";
  let bestScore = 0;

  Object.entries(CATEGORY_RULES).forEach(([category, words]) => {
    const score = words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  return bestCategory;
}

module.exports = { predictCategory };
