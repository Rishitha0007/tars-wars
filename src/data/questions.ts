// Master Question Bank for TARS WARS Quiz Mission
// Extracted and validated from set1.pdf, set2.pdf, set3.pdf, and set4.pdf (50 questions each = 200 total)
// Preserves exact original question wording, options A-D, and PDF final-page answer keys.

export interface QuestionBankItem {
  id: string;
  sequenceId: number;
  sourcePdf: string;
  originalQNum: number;
  questionText: string;
  options: string[];
  correctOptionLetter: 'A' | 'B' | 'C' | 'D';
  correctOptionIndex: number;
  correctOptionText: string;
  category: string;
  explanation: string;
}

export const QUESTION_BANK: QuestionBankItem[] = [
  {
    "id": "set1_q1",
    "sequenceId": 1,
    "sourcePdf": "set1.pdf",
    "originalQNum": 1,
    "questionText": "What is translating an idea into a valuable product or service?",
    "options": [
      "Invention",
      "Innovation",
      "Management",
      "Planning"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Innovation",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Innovation\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q2",
    "sequenceId": 2,
    "sourcePdf": "set1.pdf",
    "originalQNum": 2,
    "questionText": "Who defined an entrepreneur as an innovator?",
    "options": [
      "Adam Smith",
      "Joseph Schumpeter",
      "Peter Drucker",
      "Alfred Marshall"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Joseph Schumpeter",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Joseph Schumpeter\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q3",
    "sequenceId": 3,
    "sourcePdf": "set1.pdf",
    "originalQNum": 3,
    "questionText": "What is entrepreneurship within an existing company called?",
    "options": [
      "Intrapreneurship",
      "Extrapreneurship",
      "Franchising",
      "Partnership"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Intrapreneurship",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Intrapreneurship\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q4",
    "sequenceId": 4,
    "sourcePdf": "set1.pdf",
    "originalQNum": 4,
    "questionText": "What is a new business seeking a scalable model called?",
    "options": [
      "Corporation",
      "Startup",
      "Enterprise",
      "Conglomerate"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Startup",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Startup\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q5",
    "sequenceId": 5,
    "sourcePdf": "set1.pdf",
    "originalQNum": 5,
    "questionText": "Who are wealthy individuals that fund early-stage startups?",
    "options": [
      "Bank Managers",
      "Angel Investors",
      "Microfinanciers",
      "Venture Capitalists"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Angel Investors",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Angel Investors\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q6",
    "sequenceId": 6,
    "sourcePdf": "set1.pdf",
    "originalQNum": 6,
    "questionText": "Which document details a startup's goals and financial plans?",
    "options": [
      "Balance Sheet",
      "Business Plan",
      "Pitch Deck",
      "Income Statement"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Business Plan",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Business Plan\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q7",
    "sequenceId": 7,
    "sourcePdf": "set1.pdf",
    "originalQNum": 7,
    "questionText": "What is a short presentation used to attract investors?",
    "options": [
      "Executive Summary",
      "Pitch Deck",
      "White Paper",
      "Portfolio"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Pitch Deck",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Pitch Deck\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q8",
    "sequenceId": 8,
    "sourcePdf": "set1.pdf",
    "originalQNum": 8,
    "questionText": "What is the basic early version of a product used for learning?",
    "options": [
      "Final Product",
      "Minimum Viable Product",
      "Prototype",
      "Beta Release"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Minimum Viable Product",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Minimum Viable Product\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q9",
    "sequenceId": 9,
    "sourcePdf": "set1.pdf",
    "originalQNum": 9,
    "questionText": "Which canvas framework describes how a company creates value?",
    "options": [
      "SWOT Canvas",
      "Business Model Canvas",
      "PESTEL Canvas",
      "Value Chain Canvas"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Business Model Canvas",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Business Model Canvas\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q10",
    "sequenceId": 10,
    "sourcePdf": "set1.pdf",
    "originalQNum": 10,
    "questionText": "What is a fundamental change in a startup's strategy called?",
    "options": [
      "Launch",
      "Pivot",
      "Scale",
      "Exit"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Pivot",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Pivot\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q11",
    "sequenceId": 11,
    "sourcePdf": "set1.pdf",
    "originalQNum": 11,
    "questionText": "What is raising small amounts of money online from many people?",
    "options": [
      "Bootstrapping",
      "Crowdfunding",
      "Venture Capital",
      "Microfinance"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Crowdfunding",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Crowdfunding\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q12",
    "sequenceId": 12,
    "sourcePdf": "set1.pdf",
    "originalQNum": 12,
    "questionText": "What is starting a business using only personal savings?",
    "options": [
      "Crowdfunding",
      "Bootstrapping",
      "Franchising",
      "Angel Funding"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Bootstrapping",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Bootstrapping\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q13",
    "sequenceId": 13,
    "sourcePdf": "set1.pdf",
    "originalQNum": 13,
    "questionText": "At what point do total revenues equal total costs?",
    "options": [
      "Payback Point",
      "Break-even Point",
      "Maturity Point",
      "Equilibrium Point"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Break-even Point",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Break-even Point\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q14",
    "sequenceId": 14,
    "sourcePdf": "set1.pdf",
    "originalQNum": 14,
    "questionText": "What analysis looks at Strengths, Weaknesses, Opportunities, and Threats?",
    "options": [
      "PESTEL",
      "SWOT",
      "Ansoff",
      "BCG"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "SWOT",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"SWOT\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q15",
    "sequenceId": 15,
    "sourcePdf": "set1.pdf",
    "originalQNum": 15,
    "questionText": "What type of innovation creates a new market and displaces old ones?",
    "options": [
      "Incremental",
      "Disruptive",
      "Process",
      "Sustaining"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Disruptive",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Disruptive\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q16",
    "sequenceId": 16,
    "sourcePdf": "set1.pdf",
    "originalQNum": 16,
    "questionText": "What protects original creative works like music or literature?",
    "options": [
      "Patent",
      "Copyright",
      "Trademark",
      "Trade Secret"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Copyright",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Copyright\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q17",
    "sequenceId": 17,
    "sourcePdf": "set1.pdf",
    "originalQNum": 17,
    "questionText": "What legal protection gives an inventor exclusive rights to an invention?",
    "options": [
      "Trademark",
      "Patent",
      "Copyright",
      "License"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Patent",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Patent\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q18",
    "sequenceId": 18,
    "sourcePdf": "set1.pdf",
    "originalQNum": 18,
    "questionText": "What protects brand symbols, logos, and names?",
    "options": [
      "Patent",
      "Trademark",
      "Copyright",
      "Trade Secret"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Trademark",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Trademark\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q19",
    "sequenceId": 19,
    "sourcePdf": "set1.pdf",
    "originalQNum": 19,
    "questionText": "Which phase focuses on growing a startup rapidly?",
    "options": [
      "Ideation",
      "Scaling",
      "Validation",
      "Exit"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Scaling",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Scaling\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q20",
    "sequenceId": 20,
    "sourcePdf": "set1.pdf",
    "originalQNum": 20,
    "questionText": "What organization helps startups grow by providing space and mentorship?",
    "options": [
      "Bank",
      "Incubator",
      "Union",
      "Firm"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Incubator",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Incubator\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q21",
    "sequenceId": 21,
    "sourcePdf": "set1.pdf",
    "originalQNum": 21,
    "questionText": "What user-centered approach focuses on empathy and rapid testing?",
    "options": [
      "Agile",
      "Design Thinking",
      "Six Sigma",
      "Waterfall"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Design Thinking",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Design Thinking\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q22",
    "sequenceId": 22,
    "sourcePdf": "set1.pdf",
    "originalQNum": 22,
    "questionText": "What is a private startup valued at over $1 billion called?",
    "options": [
      "Gazelle",
      "Unicorn",
      "Decacorn",
      "Zebra"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Unicorn",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Unicorn\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q23",
    "sequenceId": 23,
    "sourcePdf": "set1.pdf",
    "originalQNum": 23,
    "questionText": "What rate measures how fast a startup spends its money?",
    "options": [
      "Run Rate",
      "Burn Rate",
      "Churn Rate",
      "Growth Rate"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Burn Rate",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Burn Rate\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q24",
    "sequenceId": 24,
    "sourcePdf": "set1.pdf",
    "originalQNum": 24,
    "questionText": "What is targeting a small, specific market segment called?",
    "options": [
      "Mass Marketing",
      "Niche Marketing",
      "Direct Marketing",
      "Global Marketing"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Niche Marketing",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Niche Marketing\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q25",
    "sequenceId": 25,
    "sourcePdf": "set1.pdf",
    "originalQNum": 25,
    "questionText": "What business model solves social problems while earning profit?",
    "options": [
      "Non-Profit",
      "Social Enterprise",
      "Public Utility",
      "Conglomerate"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Social Enterprise",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Social Enterprise\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q26",
    "sequenceId": 26,
    "sourcePdf": "set1.pdf",
    "originalQNum": 26,
    "questionText": "What percentage of customers stop using a product over time?",
    "options": [
      "Retention Rate",
      "Churn Rate",
      "Conversion Rate",
      "Growth Rate"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Churn Rate",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Churn Rate\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q27",
    "sequenceId": 27,
    "sourcePdf": "set1.pdf",
    "originalQNum": 27,
    "questionText": "What is selling startup shares on the public stock market for the first time?",
    "options": [
      "Acquisition",
      "IPO",
      "Liquidation",
      "Merger"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "IPO",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"IPO\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q28",
    "sequenceId": 28,
    "sourcePdf": "set1.pdf",
    "originalQNum": 28,
    "questionText": "What are small, continuous improvements to a product called?",
    "options": [
      "Radical Innovation",
      "Incremental Innovation",
      "Disruptive Innovation",
      "Open Innovation"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Incremental Innovation",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Incremental Innovation\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q29",
    "sequenceId": 29,
    "sourcePdf": "set1.pdf",
    "originalQNum": 29,
    "questionText": "What innovation model uses external ideas and technologies?",
    "options": [
      "Closed Innovation",
      "Open Innovation",
      "Private Development",
      "Solo Innovation"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Open Innovation",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Open Innovation\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q30",
    "sequenceId": 30,
    "sourcePdf": "set1.pdf",
    "originalQNum": 30,
    "questionText": "What outlines how a company will make money?",
    "options": [
      "Revenue Model",
      "Mission Statement",
      "Strategic Plan",
      "Org Chart"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Revenue Model",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Revenue Model\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q31",
    "sequenceId": 31,
    "sourcePdf": "set1.pdf",
    "originalQNum": 31,
    "questionText": "What is the total expected revenue from one customer over time?",
    "options": [
      "CAC",
      "CLV",
      "ROI",
      "Margin"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "CLV",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"CLV\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q32",
    "sequenceId": 32,
    "sourcePdf": "set1.pdf",
    "originalQNum": 32,
    "questionText": "What is the cost to gain a new customer?",
    "options": [
      "Operating Cost",
      "Customer Acquisition Cost",
      "Overhead Cost",
      "Fixed Cost"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Customer Acquisition Cost",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Customer Acquisition Cost\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q33",
    "sequenceId": 33,
    "sourcePdf": "set1.pdf",
    "originalQNum": 33,
    "questionText": "What type of risk is carefully evaluated before taking action?",
    "options": [
      "High Risk",
      "Calculated Risk",
      "Pure Risk",
      "Blind Risk"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Calculated Risk",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Calculated Risk\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q34",
    "sequenceId": 34,
    "sourcePdf": "set1.pdf",
    "originalQNum": 34,
    "questionText": "What is licensing a complete business model and brand to another person?",
    "options": [
      "Joint Venture",
      "Franchising",
      "Merger",
      "Partnership"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Franchising",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Franchising\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q35",
    "sequenceId": 35,
    "sourcePdf": "set1.pdf",
    "originalQNum": 35,
    "questionText": "What defines a scalable business model?",
    "options": [
      "Revenues grow faster than costs",
      "Costs grow faster than revenues",
      "Costs and revenues stay equal",
      "Employee count matches customer count"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Revenues grow faster than costs",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Revenues grow faster than costs\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q36",
    "sequenceId": 36,
    "sourcePdf": "set1.pdf",
    "originalQNum": 36,
    "questionText": "Which statement shows profit or loss over time?",
    "options": [
      "Balance Sheet",
      "Income Statement",
      "Cash Flow Statement",
      "Budget"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Income Statement",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Income Statement\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q37",
    "sequenceId": 37,
    "sourcePdf": "set1.pdf",
    "originalQNum": 37,
    "questionText": "What is an early sample built to test a product concept?",
    "options": [
      "Blueprint",
      "Prototype",
      "Wireframe",
      "Final Draft"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Prototype",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Prototype\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q38",
    "sequenceId": 38,
    "sourcePdf": "set1.pdf",
    "originalQNum": 38,
    "questionText": "What protects confidential business information like recipes or formulas?",
    "options": [
      "Patent",
      "Trade Secret",
      "Copyright",
      "Trademark"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Trade Secret",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Trade Secret\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q39",
    "sequenceId": 39,
    "sourcePdf": "set1.pdf",
    "originalQNum": 39,
    "questionText": "What is testing an idea with real customers to confirm demand?",
    "options": [
      "Ideation",
      "Market Validation",
      "Scaling",
      "Production"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Market Validation",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Market Validation\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q40",
    "sequenceId": 40,
    "sourcePdf": "set1.pdf",
    "originalQNum": 40,
    "questionText": "What institutional funding goes to high-growth, high-risk startups?",
    "options": [
      "Bank Loan",
      "Venture Capital",
      "Personal Grant",
      "Microloan"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Venture Capital",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Venture Capital\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q41",
    "sequenceId": 41,
    "sourcePdf": "set1.pdf",
    "originalQNum": 41,
    "questionText": "What makes a product better than its competitors?",
    "options": [
      "Cost Structure",
      "Value Proposition",
      "Key Resource",
      "Sales Channel"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Value Proposition",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Value Proposition\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q42",
    "sequenceId": 42,
    "sourcePdf": "set1.pdf",
    "originalQNum": 42,
    "questionText": "What is the first stage of Design Thinking?",
    "options": [
      "Define",
      "Empathize",
      "Ideate",
      "Test"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Empathize",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Empathize\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q43",
    "sequenceId": 43,
    "sourcePdf": "set1.pdf",
    "originalQNum": 43,
    "questionText": "What is a partnership between two companies for a specific project?",
    "options": [
      "Merger",
      "Joint Venture",
      "Acquisition",
      "Subsidiary"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Joint Venture",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Joint Venture\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q44",
    "sequenceId": 44,
    "sourcePdf": "set1.pdf",
    "originalQNum": 44,
    "questionText": "How easily can an asset be converted into cash?",
    "options": [
      "Solvency",
      "Liquidity",
      "Profitability",
      "Equity"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Liquidity",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Liquidity\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q45",
    "sequenceId": 45,
    "sourcePdf": "set1.pdf",
    "originalQNum": 45,
    "questionText": "What metric measures the percentage return on an investment?",
    "options": [
      "Net Value",
      "Return on Investment",
      "Debt Ratio",
      "Gross Revenue"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Return on Investment",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Return on Investment\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q46",
    "sequenceId": 46,
    "sourcePdf": "set1.pdf",
    "originalQNum": 46,
    "questionText": "What startup type aims for rapid global growth?",
    "options": [
      "Small Business",
      "Scalable Startup",
      "Family Business",
      "Corporate Unit"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Scalable Startup",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Scalable Startup\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q47",
    "sequenceId": 47,
    "sourcePdf": "set1.pdf",
    "originalQNum": 47,
    "questionText": "What is the risky period before a startup becomes profitable?",
    "options": [
      "Churn Gap",
      "Valley of Death",
      "Scaling Trough",
      "Profit Margin"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Valley of Death",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Valley of Death\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q48",
    "sequenceId": 48,
    "sourcePdf": "set1.pdf",
    "originalQNum": 48,
    "questionText": "How long a startup can operate before running out of cash is its:",
    "options": [
      "Run Rate",
      "Runway",
      "Conversion Period",
      "Payback Time"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Runway",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Runway\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q49",
    "sequenceId": 49,
    "sourcePdf": "set1.pdf",
    "originalQNum": 49,
    "questionText": "Selling existing products to existing markets to increase share is:",
    "options": [
      "Diversification",
      "Market Penetration",
      "Product Development",
      "Market Extension"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Market Penetration",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Market Penetration\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set1_q50",
    "sequenceId": 50,
    "sourcePdf": "set1.pdf",
    "originalQNum": 50,
    "questionText": "What is achieved when a product satisfies strong market demand?",
    "options": [
      "Idea Fit",
      "Product-Market Fit",
      "Scalability Fit",
      "Brand Fit"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Product-Market Fit",
    "category": "Innovation & Entrepreneurship",
    "explanation": "Correct protocol verified: \"Product-Market Fit\". Standard classification under Innovation & Entrepreneurship."
  },
  {
    "id": "set2_q1",
    "sequenceId": 51,
    "sourcePdf": "set2.pdf",
    "originalQNum": 1,
    "questionText": "What is improving an existing product step by step?",
    "options": [
      "Liquidation",
      "Outsourcing",
      "Franchising",
      "Incremental innovation"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Incremental innovation",
    "category": "Innovation & Product",
    "explanation": "Correct protocol verified: \"Incremental innovation\". Standard classification under Innovation & Product."
  },
  {
    "id": "set2_q2",
    "sequenceId": 52,
    "sourcePdf": "set2.pdf",
    "originalQNum": 2,
    "questionText": "What is a completely new approach that changes a market?",
    "options": [
      "Disruptive innovation",
      "Routine maintenance",
      "Stock counting",
      "Payroll review"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Disruptive innovation",
    "category": "Innovation & Product",
    "explanation": "Correct protocol verified: \"Disruptive innovation\". Standard classification under Innovation & Product."
  },
  {
    "id": "set2_q3",
    "sequenceId": 53,
    "sourcePdf": "set2.pdf",
    "originalQNum": 3,
    "questionText": "What is learning by building and testing quickly called?",
    "options": [
      "Price fixing",
      "Annual auditing",
      "Bulk purchasing",
      "Rapid prototyping"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Rapid prototyping",
    "category": "Engineering & Prototyping",
    "explanation": "Correct protocol verified: \"Rapid prototyping\". Standard classification under Engineering & Prototyping."
  },
  {
    "id": "set2_q4",
    "sequenceId": 54,
    "sourcePdf": "set2.pdf",
    "originalQNum": 4,
    "questionText": "What is a written description of a target customer called?",
    "options": [
      "Patent number",
      "Flight manifest",
      "Balance sheet",
      "Customer persona"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Customer persona",
    "category": "Design & Validation",
    "explanation": "Correct protocol verified: \"Customer persona\". Standard classification under Design & Validation."
  },
  {
    "id": "set2_q5",
    "sequenceId": 55,
    "sourcePdf": "set2.pdf",
    "originalQNum": 5,
    "questionText": "What is the smallest group of features that solves a core need?",
    "options": [
      "NDA",
      "GPS",
      "IPO",
      "MVP"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "MVP",
    "category": "Product Management",
    "explanation": "Correct protocol verified: \"MVP\". Standard classification under Product Management."
  },
  {
    "id": "set2_q6",
    "sequenceId": 56,
    "sourcePdf": "set2.pdf",
    "originalQNum": 6,
    "questionText": "What is the difference between revenue and expenses called?",
    "options": [
      "Customer count",
      "Brand value",
      "Market niche",
      "Net income"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Net income",
    "category": "Finance & Accounting",
    "explanation": "Correct protocol verified: \"Net income\". Standard classification under Finance & Accounting."
  },
  {
    "id": "set2_q7",
    "sequenceId": 57,
    "sourcePdf": "set2.pdf",
    "originalQNum": 7,
    "questionText": "What is the share of a market held by a company called?",
    "options": [
      "Market share",
      "Unit cost",
      "Burn rate",
      "Cash runway"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Market share",
    "category": "Market Strategy",
    "explanation": "Correct protocol verified: \"Market share\". Standard classification under Market Strategy."
  },
  {
    "id": "set2_q8",
    "sequenceId": 58,
    "sourcePdf": "set2.pdf",
    "originalQNum": 8,
    "questionText": "What is a forecast of future sales called?",
    "options": [
      "Mission patch",
      "Prototype test",
      "Patent claim",
      "Sales projection"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Sales projection",
    "category": "Market Strategy",
    "explanation": "Correct protocol verified: \"Sales projection\". Standard classification under Market Strategy."
  },
  {
    "id": "set2_q9",
    "sequenceId": 59,
    "sourcePdf": "set2.pdf",
    "originalQNum": 9,
    "questionText": "What is a written record of money entering and leaving a business?",
    "options": [
      "Cash-flow statement",
      "Brand manual",
      "Flight checklist",
      "User persona"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Cash-flow statement",
    "category": "Finance & Accounting",
    "explanation": "Correct protocol verified: \"Cash-flow statement\". Standard classification under Finance & Accounting."
  },
  {
    "id": "set2_q10",
    "sequenceId": 60,
    "sourcePdf": "set2.pdf",
    "originalQNum": 10,
    "questionText": "What is a company’s reason for existing called?",
    "options": [
      "Dividend",
      "Liability",
      "Invoice",
      "Mission"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Mission",
    "category": "Business Strategy",
    "explanation": "Correct protocol verified: \"Mission\". Standard classification under Business Strategy."
  },
  {
    "id": "set2_q11",
    "sequenceId": 61,
    "sourcePdf": "set2.pdf",
    "originalQNum": 11,
    "questionText": "What is the process of protecting an original invention called?",
    "options": [
      "Market testing",
      "Cash budgeting",
      "IP protection",
      "Customer retention"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "IP protection",
    "category": "Intellectual Property",
    "explanation": "Correct protocol verified: \"IP protection\". Standard classification under Intellectual Property."
  },
  {
    "id": "set2_q12",
    "sequenceId": 62,
    "sourcePdf": "set2.pdf",
    "originalQNum": 12,
    "questionText": "What is selling the rights to use technology for a fee called?",
    "options": [
      "Bootstrapping",
      "Liquidation",
      "Licensing",
      "Crowdfunding"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Licensing",
    "category": "Intellectual Property",
    "explanation": "Correct protocol verified: \"Licensing\". Standard classification under Intellectual Property."
  },
  {
    "id": "set2_q13",
    "sequenceId": 63,
    "sourcePdf": "set2.pdf",
    "originalQNum": 13,
    "questionText": "What is a company that buys another company doing?",
    "options": [
      "A/B testing",
      "Prototyping",
      "Ideation",
      "Acquisition"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Acquisition",
    "category": "Corporate Strategy",
    "explanation": "Correct protocol verified: \"Acquisition\". Standard classification under Corporate Strategy."
  },
  {
    "id": "set2_q14",
    "sequenceId": 64,
    "sourcePdf": "set2.pdf",
    "originalQNum": 14,
    "questionText": "What is combining two companies into one called?",
    "options": [
      "Merger",
      "Pivot",
      "Subscription",
      "Prototype"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Merger",
    "category": "Corporate Strategy",
    "explanation": "Correct protocol verified: \"Merger\". Standard classification under Corporate Strategy."
  },
  {
    "id": "set2_q15",
    "sequenceId": 65,
    "sourcePdf": "set2.pdf",
    "originalQNum": 15,
    "questionText": "What is a business plan's summary section often called?",
    "options": [
      "User manual",
      "Executive summary",
      "Flight log",
      "Patent label"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Executive summary",
    "category": "Business Strategy",
    "explanation": "Correct protocol verified: \"Executive summary\". Standard classification under Business Strategy."
  },
  {
    "id": "set2_q16",
    "sequenceId": 66,
    "sourcePdf": "set2.pdf",
    "originalQNum": 16,
    "questionText": "What is a repeated customer payment model called?",
    "options": [
      "One-time expense",
      "Trade secret",
      "Fixed asset",
      "Recurring revenue"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Recurring revenue",
    "category": "Business Models",
    "explanation": "Correct protocol verified: \"Recurring revenue\". Standard classification under Business Models."
  },
  {
    "id": "set2_q17",
    "sequenceId": 67,
    "sourcePdf": "set2.pdf",
    "originalQNum": 17,
    "questionText": "What is making a product available to more customers called?",
    "options": [
      "Liquidation",
      "Scaling",
      "Validation only",
      "Ideation"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Scaling",
    "category": "Scaling & Growth",
    "explanation": "Correct protocol verified: \"Scaling\". Standard classification under Scaling & Growth."
  },
  {
    "id": "set2_q18",
    "sequenceId": 68,
    "sourcePdf": "set2.pdf",
    "originalQNum": 18,
    "questionText": "What is the amount spent to make one unit called?",
    "options": [
      "Brand equity",
      "Market share",
      "Unit cost",
      "Cash runway"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Unit cost",
    "category": "Finance & Operations",
    "explanation": "Correct protocol verified: \"Unit cost\". Standard classification under Finance & Operations."
  },
  {
    "id": "set2_q19",
    "sequenceId": 69,
    "sourcePdf": "set2.pdf",
    "originalQNum": 19,
    "questionText": "What is a method for comparing competitors called?",
    "options": [
      "Orbit analysis",
      "Payload testing",
      "Competitive analysis",
      "Altitude reading"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Competitive analysis",
    "category": "Market Research",
    "explanation": "Correct protocol verified: \"Competitive analysis\". Standard classification under Market Research."
  },
  {
    "id": "set2_q20",
    "sequenceId": 70,
    "sourcePdf": "set2.pdf",
    "originalQNum": 20,
    "questionText": "What is a group of organizations working together called?",
    "options": [
      "Invoice",
      "Prototype",
      "Consortium",
      "Monopoly only"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Consortium",
    "category": "Organizational Structure",
    "explanation": "Correct protocol verified: \"Consortium\". Standard classification under Organizational Structure."
  },
  {
    "id": "set2_q21",
    "sequenceId": 71,
    "sourcePdf": "set2.pdf",
    "originalQNum": 21,
    "questionText": "What is the engine nozzle's main function?",
    "options": [
      "Generate solar power",
      "Direct exhaust flow",
      "Store satellite data",
      "Measure altitude"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Direct exhaust flow",
    "category": "Aerospace Propulsion",
    "explanation": "Correct protocol verified: \"Direct exhaust flow\". Standard classification under Aerospace Propulsion."
  },
  {
    "id": "set2_q22",
    "sequenceId": 72,
    "sourcePdf": "set2.pdf",
    "originalQNum": 22,
    "questionText": "What is the structure that supports an aircraft's wings called?",
    "options": [
      "Solar array",
      "Heat shield",
      "Payload fairing",
      "Wing spar"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Wing spar",
    "category": "Aeronautics & Aerodynamics",
    "explanation": "Correct protocol verified: \"Wing spar\". Standard classification under Aeronautics & Aerodynamics."
  },
  {
    "id": "set2_q23",
    "sequenceId": 73,
    "sourcePdf": "set2.pdf",
    "originalQNum": 23,
    "questionText": "What is the movable surface used to control aircraft pitch called?",
    "options": [
      "Aileron",
      "Elevator",
      "Spoiler only",
      "Rudder"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Elevator",
    "category": "Aeronautics & Aerodynamics",
    "explanation": "Correct protocol verified: \"Elevator\". Standard classification under Aeronautics & Aerodynamics."
  },
  {
    "id": "set2_q24",
    "sequenceId": 74,
    "sourcePdf": "set2.pdf",
    "originalQNum": 24,
    "questionText": "What aircraft control surface helps control roll?",
    "options": [
      "Landing gear",
      "Nose cone",
      "Aileron",
      "Elevator"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Aileron",
    "category": "Aeronautics & Aerodynamics",
    "explanation": "Correct protocol verified: \"Aileron\". Standard classification under Aeronautics & Aerodynamics."
  },
  {
    "id": "set2_q25",
    "sequenceId": 75,
    "sourcePdf": "set2.pdf",
    "originalQNum": 25,
    "questionText": "What surface helps control an aircraft's yaw?",
    "options": [
      "Flap",
      "Wing spar",
      "Rudder",
      "Elevator"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Rudder",
    "category": "Aeronautics & Aerodynamics",
    "explanation": "Correct protocol verified: \"Rudder\". Standard classification under Aeronautics & Aerodynamics."
  },
  {
    "id": "set2_q26",
    "sequenceId": 76,
    "sourcePdf": "set2.pdf",
    "originalQNum": 26,
    "questionText": "What is the streamlined body of a rocket or aircraft called?",
    "options": [
      "Solar array",
      "Fuselage or body",
      "Telemetry",
      "Orbit"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Fuselage or body",
    "category": "Aerospace Structures",
    "explanation": "Correct protocol verified: \"Fuselage or body\". Standard classification under Aerospace Structures."
  },
  {
    "id": "set2_q27",
    "sequenceId": 77,
    "sourcePdf": "set2.pdf",
    "originalQNum": 27,
    "questionText": "What does an airfoil help create?",
    "options": [
      "Satellite signals",
      "Rocket fuel",
      "Revenue",
      "Lift"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Lift",
    "category": "Aerodynamics",
    "explanation": "Correct protocol verified: \"Lift\". Standard classification under Aerodynamics."
  },
  {
    "id": "set2_q28",
    "sequenceId": 78,
    "sourcePdf": "set2.pdf",
    "originalQNum": 28,
    "questionText": "What is the layer of gases surrounding Earth called?",
    "options": [
      "Lithosphere",
      "Magnetosphere only",
      "Hydrosphere",
      "Atmosphere"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Atmosphere",
    "category": "Space Science & Atmosphere",
    "explanation": "Correct protocol verified: \"Atmosphere\". Standard classification under Space Science & Atmosphere."
  },
  {
    "id": "set2_q29",
    "sequenceId": 79,
    "sourcePdf": "set2.pdf",
    "originalQNum": 29,
    "questionText": "What is a geostationary satellite's approximate orbital period?",
    "options": [
      "One week",
      "One year",
      "One hour",
      "One day"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "One day",
    "category": "Orbital Mechanics",
    "explanation": "Correct protocol verified: \"One day\". Standard classification under Orbital Mechanics."
  },
  {
    "id": "set2_q30",
    "sequenceId": 80,
    "sourcePdf": "set2.pdf",
    "originalQNum": 30,
    "questionText": "What is a low Earth orbit commonly abbreviated as?",
    "options": [
      "LEO",
      "NDA",
      "MVP",
      "IPO"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "LEO",
    "category": "Orbital Mechanics",
    "explanation": "Correct protocol verified: \"LEO\". Standard classification under Orbital Mechanics."
  },
  {
    "id": "set2_q31",
    "sequenceId": 81,
    "sourcePdf": "set2.pdf",
    "originalQNum": 31,
    "questionText": "What is a satellite's onboard computer used for?",
    "options": [
      "Creating gravity",
      "Building ground stations",
      "Command and data processing",
      "Producing rocket fuel"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Command and data processing",
    "category": "Spacecraft Avionics",
    "explanation": "Correct protocol verified: \"Command and data processing\". Standard classification under Spacecraft Avionics."
  },
  {
    "id": "set2_q32",
    "sequenceId": 82,
    "sourcePdf": "set2.pdf",
    "originalQNum": 32,
    "questionText": "What is the purpose of a ground station?",
    "options": [
      "Communicate with spacecraft",
      "Generate lift for aircraft",
      "Replace mission control",
      "Produce satellite solar panels"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Communicate with spacecraft",
    "category": "Space Communications",
    "explanation": "Correct protocol verified: \"Communicate with spacecraft\". Standard classification under Space Communications."
  },
  {
    "id": "set2_q33",
    "sequenceId": 83,
    "sourcePdf": "set2.pdf",
    "originalQNum": 33,
    "questionText": "What is a rocket stage separation?",
    "options": [
      "Opening a satellite camera",
      "Detaching a spent stage",
      "Changing a company strategy",
      "Refueling an aircraft mid-flight"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Detaching a spent stage",
    "category": "Launch Vehicles",
    "explanation": "Correct protocol verified: \"Detaching a spent stage\". Standard classification under Launch Vehicles."
  },
  {
    "id": "set2_q34",
    "sequenceId": 84,
    "sourcePdf": "set2.pdf",
    "originalQNum": 34,
    "questionText": "What is a launch vehicle's guidance system for?",
    "options": [
      "Steering toward the intended path",
      "Creating oxygen",
      "Selling launch tickets",
      "Measuring business profit"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Steering toward the intended path",
    "category": "Guidance & Navigation",
    "explanation": "Correct protocol verified: \"Steering toward the intended path\". Standard classification under Guidance & Navigation."
  },
  {
    "id": "set2_q35",
    "sequenceId": 85,
    "sourcePdf": "set2.pdf",
    "originalQNum": 35,
    "questionText": "What is a satellite transponder used to do?",
    "options": [
      "Measure wing lift",
      "Deploy landing gear",
      "Receive and retransmit signals",
      "Burn rocket fuel"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Receive and retransmit signals",
    "category": "Space Communications",
    "explanation": "Correct protocol verified: \"Receive and retransmit signals\". Standard classification under Space Communications."
  },
  {
    "id": "set2_q36",
    "sequenceId": 86,
    "sourcePdf": "set2.pdf",
    "originalQNum": 36,
    "questionText": "What is an astronaut's activity outside a spacecraft called?",
    "options": [
      "Taxiing",
      "Gliding",
      "Dockside loading",
      "Spacewalk"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Spacewalk",
    "category": "Human Spaceflight",
    "explanation": "Correct protocol verified: \"Spacewalk\". Standard classification under Human Spaceflight."
  },
  {
    "id": "set2_q37",
    "sequenceId": 87,
    "sourcePdf": "set2.pdf",
    "originalQNum": 37,
    "questionText": "What is docking in spaceflight?",
    "options": [
      "Entering Earth's atmosphere",
      "Joining two spacecraft or a spacecraft and station",
      "Landing on a runway",
      "Separating rocket stages"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Joining two spacecraft or a spacecraft and station",
    "category": "Spaceflight Operations",
    "explanation": "Correct protocol verified: \"Joining two spacecraft or a spacecraft and station\". Standard classification under Spaceflight Operations."
  },
  {
    "id": "set2_q38",
    "sequenceId": 88,
    "sourcePdf": "set2.pdf",
    "originalQNum": 38,
    "questionText": "What is re-entry?",
    "options": [
      "Starting a business",
      "Returning through a planet's atmosphere",
      "Deploying a satellite antenna",
      "Entering a hangar"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Returning through a planet's atmosphere",
    "category": "Atmospheric Entry",
    "explanation": "Correct protocol verified: \"Returning through a planet's atmosphere\". Standard classification under Atmospheric Entry."
  },
  {
    "id": "set2_q39",
    "sequenceId": 89,
    "sourcePdf": "set2.pdf",
    "originalQNum": 39,
    "questionText": "What is a parachute used for on some returning spacecraft?",
    "options": [
      "Generating electricity",
      "Increasing orbital speed",
      "Slowing descent",
      "Measuring distance"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Slowing descent",
    "category": "Recovery & Deceleration",
    "explanation": "Correct protocol verified: \"Slowing descent\". Standard classification under Recovery & Deceleration."
  },
  {
    "id": "set2_q40",
    "sequenceId": 90,
    "sourcePdf": "set2.pdf",
    "originalQNum": 40,
    "questionText": "What is the main purpose of a satellite navigation system?",
    "options": [
      "Repair aircraft wings",
      "Grow crops directly",
      "Create rocket thrust",
      "Provide position and timing information"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Provide position and timing information",
    "category": "Satellite Navigation",
    "explanation": "Correct protocol verified: \"Provide position and timing information\". Standard classification under Satellite Navigation."
  },
  {
    "id": "set2_q41",
    "sequenceId": 91,
    "sourcePdf": "set2.pdf",
    "originalQNum": 41,
    "questionText": "What is a nanosatellite generally known for?",
    "options": [
      "Flying without a launch",
      "Using no power",
      "Being larger than a space station",
      "Small size and mass"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Small size and mass",
    "category": "Small Satellites",
    "explanation": "Correct protocol verified: \"Small size and mass\". Standard classification under Small Satellites."
  },
  {
    "id": "set2_q42",
    "sequenceId": 92,
    "sourcePdf": "set2.pdf",
    "originalQNum": 42,
    "questionText": "What is additive manufacturing commonly called?",
    "options": [
      "Laser navigation",
      "Thermal shielding",
      "Remote sensing",
      "3D printing"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "3D printing",
    "category": "Advanced Manufacturing",
    "explanation": "Correct protocol verified: \"3D printing\". Standard classification under Advanced Manufacturing."
  },
  {
    "id": "set2_q43",
    "sequenceId": 93,
    "sourcePdf": "set2.pdf",
    "originalQNum": 43,
    "questionText": "How can 3D printing help aerospace production?",
    "options": [
      "Eliminate design constraints",
      "Make complex lightweight parts",
      "Create gravity",
      "Remove all testing needs"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Make complex lightweight parts",
    "category": "Aerospace Production",
    "explanation": "Correct protocol verified: \"Make complex lightweight parts\". Standard classification under Aerospace Production."
  },
  {
    "id": "set2_q44",
    "sequenceId": 94,
    "sourcePdf": "set2.pdf",
    "originalQNum": 44,
    "questionText": "What is a digital twin?",
    "options": [
      "A funding agreement",
      "A second physical rocket",
      "A type of satellite orbit",
      "A virtual model of a real system"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "A virtual model of a real system",
    "category": "Simulation & Modeling",
    "explanation": "Correct protocol verified: \"A virtual model of a real system\". Standard classification under Simulation & Modeling."
  },
  {
    "id": "set2_q45",
    "sequenceId": 95,
    "sourcePdf": "set2.pdf",
    "originalQNum": 45,
    "questionText": "What is predictive maintenance intended to do?",
    "options": [
      "Reduce product testing",
      "Increase unexpected failures",
      "Anticipate equipment problems",
      "Replace all inspections blindly"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Anticipate equipment problems",
    "category": "Reliability & Maintenance",
    "explanation": "Correct protocol verified: \"Anticipate equipment problems\". Standard classification under Reliability & Maintenance."
  },
  {
    "id": "set2_q46",
    "sequenceId": 96,
    "sourcePdf": "set2.pdf",
    "originalQNum": 46,
    "questionText": "What does AI-assisted satellite imagery help with?",
    "options": [
      "Finding patterns in images",
      "Generating rocket thrust",
      "Replacing orbital mechanics",
      "Eliminating ground stations"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Finding patterns in images",
    "category": "AI & Remote Sensing",
    "explanation": "Correct protocol verified: \"Finding patterns in images\". Standard classification under AI & Remote Sensing."
  },
  {
    "id": "set2_q47",
    "sequenceId": 97,
    "sourcePdf": "set2.pdf",
    "originalQNum": 47,
    "questionText": "What is a key benefit of lightweight aerospace materials?",
    "options": [
      "Lower mass",
      "Higher fuel use by design",
      "Reduced payload capacity",
      "More orbital debris"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Lower mass",
    "category": "Materials Science",
    "explanation": "Correct protocol verified: \"Lower mass\". Standard classification under Materials Science."
  },
  {
    "id": "set2_q48",
    "sequenceId": 98,
    "sourcePdf": "set2.pdf",
    "originalQNum": 48,
    "questionText": "What is a startup accelerator often designed to provide?",
    "options": [
      "Permanent government ownership",
      "Automatic patent approval",
      "Only warehouse space",
      "Time-limited mentoring and growth support"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Time-limited mentoring and growth support",
    "category": "Entrepreneurship & Ecosystems",
    "explanation": "Correct protocol verified: \"Time-limited mentoring and growth support\". Standard classification under Entrepreneurship & Ecosystems."
  },
  {
    "id": "set2_q49",
    "sequenceId": 99,
    "sourcePdf": "set2.pdf",
    "originalQNum": 49,
    "questionText": "What is a key purpose of a business incubator?",
    "options": [
      "Guarantee profits",
      "Help early ventures develop",
      "Control aircraft traffic",
      "Issue launch licenses automatically"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Help early ventures develop",
    "category": "Entrepreneurship & Ecosystems",
    "explanation": "Correct protocol verified: \"Help early ventures develop\". Standard classification under Entrepreneurship & Ecosystems."
  },
  {
    "id": "set2_q50",
    "sequenceId": 100,
    "sourcePdf": "set2.pdf",
    "originalQNum": 50,
    "questionText": "What is responsible innovation meant to consider?",
    "options": [
      "Marketing alone",
      "Speed alone",
      "Safety, people, and environmental impact",
      "Profit alone"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Safety, people, and environmental impact",
    "category": "Ethics & Responsible Tech",
    "explanation": "Correct protocol verified: \"Safety, people, and environmental impact\". Standard classification under Ethics & Responsible Tech."
  },
  {
    "id": "set3_q1",
    "sequenceId": 101,
    "sourcePdf": "set3.pdf",
    "originalQNum": 1,
    "questionText": "What is the first step in solving a customer problem?",
    "options": [
      "Identify the need",
      "Set the final price",
      "Launch worldwide",
      "Hire a large team"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Identify the need",
    "category": "Customer Discovery",
    "explanation": "Correct protocol verified: \"Identify the need\". Standard classification under Customer Discovery."
  },
  {
    "id": "set3_q2",
    "sequenceId": 102,
    "sourcePdf": "set3.pdf",
    "originalQNum": 2,
    "questionText": "What is a one-sentence description of a business idea called?",
    "options": [
      "Elevator pitch",
      "Flight plan",
      "Patent claim",
      "Cash ledger"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Elevator pitch",
    "category": "Communication & Pitching",
    "explanation": "Correct protocol verified: \"Elevator pitch\". Standard classification under Communication & Pitching."
  },
  {
    "id": "set3_q3",
    "sequenceId": 103,
    "sourcePdf": "set3.pdf",
    "originalQNum": 3,
    "questionText": "What is a group of people building a new business called?",
    "options": [
      "Customer panel",
      "Trade union",
      "Flight crew only",
      "Startup team"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Startup team",
    "category": "Team & Organization",
    "explanation": "Correct protocol verified: \"Startup team\". Standard classification under Team & Organization."
  },
  {
    "id": "set3_q4",
    "sequenceId": 104,
    "sourcePdf": "set3.pdf",
    "originalQNum": 4,
    "questionText": "What is the process of generating possible solutions called?",
    "options": [
      "Liquidation",
      "Distribution",
      "Depreciation",
      "Ideation"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Ideation",
    "category": "Design Thinking",
    "explanation": "Correct protocol verified: \"Ideation\". Standard classification under Design Thinking."
  },
  {
    "id": "set3_q5",
    "sequenceId": 105,
    "sourcePdf": "set3.pdf",
    "originalQNum": 5,
    "questionText": "What is a product feature customers value most called?",
    "options": [
      "Invoice",
      "Overhead",
      "Key benefit",
      "Penalty"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Key benefit",
    "category": "Value Proposition",
    "explanation": "Correct protocol verified: \"Key benefit\". Standard classification under Value Proposition."
  },
  {
    "id": "set3_q6",
    "sequenceId": 106,
    "sourcePdf": "set3.pdf",
    "originalQNum": 6,
    "questionText": "What is a planned estimate of income and spending?",
    "options": [
      "Trademark",
      "Prototype",
      "Mission patch",
      "Budget"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Budget",
    "category": "Financial Planning",
    "explanation": "Correct protocol verified: \"Budget\". Standard classification under Financial Planning."
  },
  {
    "id": "set3_q7",
    "sequenceId": 107,
    "sourcePdf": "set3.pdf",
    "originalQNum": 7,
    "questionText": "What does B2B mean?",
    "options": [
      "Business to business",
      "Budget to balance",
      "Buyer to bank",
      "Brand to brand"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Business to business",
    "category": "Business Models",
    "explanation": "Correct protocol verified: \"Business to business\". Standard classification under Business Models."
  },
  {
    "id": "set3_q8",
    "sequenceId": 108,
    "sourcePdf": "set3.pdf",
    "originalQNum": 8,
    "questionText": "What does B2C mean?",
    "options": [
      "Budget to customer",
      "Bank to company",
      "Business to consumer",
      "Brand to creator"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Business to consumer",
    "category": "Business Models",
    "explanation": "Correct protocol verified: \"Business to consumer\". Standard classification under Business Models."
  },
  {
    "id": "set3_q9",
    "sequenceId": 109,
    "sourcePdf": "set3.pdf",
    "originalQNum": 9,
    "questionText": "What is the cost of gaining one customer called?",
    "options": [
      "Asset value",
      "Customer acquisition cost",
      "Annual flight cost",
      "Cash balance"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Customer acquisition cost",
    "category": "Growth & Unit Economics",
    "explanation": "Correct protocol verified: \"Customer acquisition cost\". Standard classification under Growth & Unit Economics."
  },
  {
    "id": "set3_q10",
    "sequenceId": 110,
    "sourcePdf": "set3.pdf",
    "originalQNum": 10,
    "questionText": "What is the percentage of users who keep using a service called?",
    "options": [
      "Retention rate",
      "Exchange rate",
      "Burn rate",
      "Interest rate"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Retention rate",
    "category": "Metrics & Analytics",
    "explanation": "Correct protocol verified: \"Retention rate\". Standard classification under Metrics & Analytics."
  },
  {
    "id": "set3_q11",
    "sequenceId": 111,
    "sourcePdf": "set3.pdf",
    "originalQNum": 11,
    "questionText": "What is feedback gathered through direct questions called?",
    "options": [
      "Customer interview",
      "Tax audit",
      "Patent search",
      "Product shipment"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Customer interview",
    "category": "Customer Research",
    "explanation": "Correct protocol verified: \"Customer interview\". Standard classification under Customer Research."
  },
  {
    "id": "set3_q12",
    "sequenceId": 112,
    "sourcePdf": "set3.pdf",
    "originalQNum": 12,
    "questionText": "What is a business owned by one person called?",
    "options": [
      "Sole proprietorship",
      "Joint venture",
      "Public company",
      "Cooperative only"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Sole proprietorship",
    "category": "Business Structures",
    "explanation": "Correct protocol verified: \"Sole proprietorship\". Standard classification under Business Structures."
  },
  {
    "id": "set3_q13",
    "sequenceId": 113,
    "sourcePdf": "set3.pdf",
    "originalQNum": 13,
    "questionText": "What is a written promise to repay borrowed money called?",
    "options": [
      "Prototype",
      "Loan agreement",
      "Brand guide",
      "Pitch deck"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Loan agreement",
    "category": "Finance & Debt",
    "explanation": "Correct protocol verified: \"Loan agreement\". Standard classification under Finance & Debt."
  },
  {
    "id": "set3_q14",
    "sequenceId": 114,
    "sourcePdf": "set3.pdf",
    "originalQNum": 14,
    "questionText": "What is the amount a company owes called?",
    "options": [
      "Asset",
      "Market share",
      "Revenue",
      "Liability"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Liability",
    "category": "Accounting & Balance Sheet",
    "explanation": "Correct protocol verified: \"Liability\". Standard classification under Accounting & Balance Sheet."
  },
  {
    "id": "set3_q15",
    "sequenceId": 115,
    "sourcePdf": "set3.pdf",
    "originalQNum": 15,
    "questionText": "What is something a business owns called?",
    "options": [
      "Asset",
      "Expense",
      "Liability",
      "Refund"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Asset",
    "category": "Accounting & Balance Sheet",
    "explanation": "Correct protocol verified: \"Asset\". Standard classification under Accounting & Balance Sheet."
  },
  {
    "id": "set3_q16",
    "sequenceId": 116,
    "sourcePdf": "set3.pdf",
    "originalQNum": 16,
    "questionText": "What is an agreement to keep information confidential called?",
    "options": [
      "NDA",
      "MVP",
      "ROI",
      "IPO"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "NDA",
    "category": "Legal & Contracts",
    "explanation": "Correct protocol verified: \"NDA\". Standard classification under Legal & Contracts."
  },
  {
    "id": "set3_q17",
    "sequenceId": 117,
    "sourcePdf": "set3.pdf",
    "originalQNum": 17,
    "questionText": "What is selling to a new geographic market called?",
    "options": [
      "Market expansion",
      "Liquidation",
      "Cost cutting",
      "Product recall"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Market expansion",
    "category": "Expansion Strategy",
    "explanation": "Correct protocol verified: \"Market expansion\". Standard classification under Expansion Strategy."
  },
  {
    "id": "set3_q18",
    "sequenceId": 118,
    "sourcePdf": "set3.pdf",
    "originalQNum": 18,
    "questionText": "What is testing two versions to compare results called?",
    "options": [
      "Crowdfunding",
      "SWOT mapping",
      "A/B testing",
      "Outsourcing"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "A/B testing",
    "category": "Experimentation",
    "explanation": "Correct protocol verified: \"A/B testing\". Standard classification under Experimentation."
  },
  {
    "id": "set3_q19",
    "sequenceId": 119,
    "sourcePdf": "set3.pdf",
    "originalQNum": 19,
    "questionText": "What is a visual identity symbol for a company called?",
    "options": [
      "Patent",
      "Invoice",
      "Logo",
      "Ledger"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Logo",
    "category": "Branding",
    "explanation": "Correct protocol verified: \"Logo\". Standard classification under Branding."
  },
  {
    "id": "set3_q20",
    "sequenceId": 120,
    "sourcePdf": "set3.pdf",
    "originalQNum": 20,
    "questionText": "What is a company that supports social needs and earns revenue?",
    "options": [
      "Social enterprise",
      "Space agency only",
      "Shell account",
      "Trade barrier"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Social enterprise",
    "category": "Social Entrepreneurship",
    "explanation": "Correct protocol verified: \"Social enterprise\". Standard classification under Social Entrepreneurship."
  },
  {
    "id": "set3_q21",
    "sequenceId": 121,
    "sourcePdf": "set3.pdf",
    "originalQNum": 21,
    "questionText": "Which part of a rocket carries useful equipment?",
    "options": [
      "Passenger aisle",
      "Propeller hub",
      "Payload fairing area",
      "Wing flap"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Payload fairing area",
    "category": "Rocket Architecture",
    "explanation": "Correct protocol verified: \"Payload fairing area\". Standard classification under Rocket Architecture."
  },
  {
    "id": "set3_q22",
    "sequenceId": 122,
    "sourcePdf": "set3.pdf",
    "originalQNum": 22,
    "questionText": "What is the rocket engine's expelled material called?",
    "options": [
      "Orbit",
      "Exhaust",
      "Payload",
      "Fuselage"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Exhaust",
    "category": "Propulsion Fundamentals",
    "explanation": "Correct protocol verified: \"Exhaust\". Standard classification under Propulsion Fundamentals."
  },
  {
    "id": "set3_q23",
    "sequenceId": 123,
    "sourcePdf": "set3.pdf",
    "originalQNum": 23,
    "questionText": "What is a rocket launch site's main role?",
    "options": [
      "Measure ocean tides only",
      "Provide launch infrastructure",
      "Control all aircraft",
      "Manufacture clouds"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Provide launch infrastructure",
    "category": "Spaceport Operations",
    "explanation": "Correct protocol verified: \"Provide launch infrastructure\". Standard classification under Spaceport Operations."
  },
  {
    "id": "set3_q24",
    "sequenceId": 124,
    "sourcePdf": "set3.pdf",
    "originalQNum": 24,
    "questionText": "What is a spacecraft's power source in sunlight often?",
    "options": [
      "Solar array",
      "Wind turbine",
      "Diesel tank",
      "Coal burner"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Solar array",
    "category": "Spacecraft Power",
    "explanation": "Correct protocol verified: \"Solar array\". Standard classification under Spacecraft Power."
  },
  {
    "id": "set3_q25",
    "sequenceId": 125,
    "sourcePdf": "set3.pdf",
    "originalQNum": 25,
    "questionText": "What is a telescope used for in astronomy?",
    "options": [
      "Printing maps",
      "Observing distant objects",
      "Repairing wings",
      "Measuring business profit"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Observing distant objects",
    "category": "Astronomy & Optics",
    "explanation": "Correct protocol verified: \"Observing distant objects\". Standard classification under Astronomy & Optics."
  },
  {
    "id": "set3_q26",
    "sequenceId": 126,
    "sourcePdf": "set3.pdf",
    "originalQNum": 26,
    "questionText": "What is the International Space Station commonly abbreviated as?",
    "options": [
      "CPU",
      "GPS",
      "LED",
      "ISS"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "ISS",
    "category": "Space Stations",
    "explanation": "Correct protocol verified: \"ISS\". Standard classification under Space Stations."
  },
  {
    "id": "set3_q27",
    "sequenceId": 127,
    "sourcePdf": "set3.pdf",
    "originalQNum": 27,
    "questionText": "What does GPS help determine?",
    "options": [
      "Wing material cost",
      "Position and navigation",
      "Rocket fuel chemistry",
      "Company valuation"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Position and navigation",
    "category": "Satellite Navigation",
    "explanation": "Correct protocol verified: \"Position and navigation\". Standard classification under Satellite Navigation."
  },
  {
    "id": "set3_q28",
    "sequenceId": 128,
    "sourcePdf": "set3.pdf",
    "originalQNum": 28,
    "questionText": "What is a space suit designed to provide?",
    "options": [
      "Aircraft lift",
      "Extra rocket thrust",
      "Life support and protection",
      "Satellite signals only"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Life support and protection",
    "category": "Life Support Systems",
    "explanation": "Correct protocol verified: \"Life support and protection\". Standard classification under Life Support Systems."
  },
  {
    "id": "set3_q29",
    "sequenceId": 129,
    "sourcePdf": "set3.pdf",
    "originalQNum": 29,
    "questionText": "What is the part of an aircraft that houses passengers called?",
    "options": [
      "Antenna dish",
      "Nozzle",
      "Solar panel",
      "Fuselage"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Fuselage",
    "category": "Aircraft Structure",
    "explanation": "Correct protocol verified: \"Fuselage\". Standard classification under Aircraft Structure."
  },
  {
    "id": "set3_q30",
    "sequenceId": 130,
    "sourcePdf": "set3.pdf",
    "originalQNum": 30,
    "questionText": "What is the force opposing motion through air?",
    "options": [
      "Lift",
      "Gravity only",
      "Drag",
      "Thrust"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Drag",
    "category": "Aerodynamics",
    "explanation": "Correct protocol verified: \"Drag\". Standard classification under Aerodynamics."
  },
  {
    "id": "set3_q31",
    "sequenceId": 131,
    "sourcePdf": "set3.pdf",
    "originalQNum": 31,
    "questionText": "What is the rotating blade that can produce lift on a helicopter?",
    "options": [
      "Nose cone",
      "Rotor",
      "Flap",
      "Rudder"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Rotor",
    "category": "Rotorcraft Dynamics",
    "explanation": "Correct protocol verified: \"Rotor\". Standard classification under Rotorcraft Dynamics."
  },
  {
    "id": "set3_q32",
    "sequenceId": 132,
    "sourcePdf": "set3.pdf",
    "originalQNum": 32,
    "questionText": "What does a flight simulator help pilots do?",
    "options": [
      "Practice procedures safely",
      "Launch satellites directly",
      "Build engines automatically",
      "Refuel in orbit"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Practice procedures safely",
    "category": "Pilot Training",
    "explanation": "Correct protocol verified: \"Practice procedures safely\". Standard classification under Pilot Training."
  },
  {
    "id": "set3_q33",
    "sequenceId": 133,
    "sourcePdf": "set3.pdf",
    "originalQNum": 33,
    "questionText": "What is an aircraft's black box used to record?",
    "options": [
      "Fuel sales",
      "Passenger tickets",
      "Weather forecasts only",
      "Flight data and cockpit audio"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Flight data and cockpit audio",
    "category": "Flight Avionics",
    "explanation": "Correct protocol verified: \"Flight data and cockpit audio\". Standard classification under Flight Avionics."
  },
  {
    "id": "set3_q34",
    "sequenceId": 134,
    "sourcePdf": "set3.pdf",
    "originalQNum": 34,
    "questionText": "What is an unmanned spacecraft sent to study a planet called?",
    "options": [
      "Passenger jet",
      "Cargo truck",
      "Planetary probe",
      "Weather balloon only"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Planetary probe",
    "category": "Planetary Exploration",
    "explanation": "Correct protocol verified: \"Planetary probe\". Standard classification under Planetary Exploration."
  },
  {
    "id": "set3_q35",
    "sequenceId": 135,
    "sourcePdf": "set3.pdf",
    "originalQNum": 35,
    "questionText": "What is a constellation of satellites?",
    "options": [
      "A coordinated group of satellites",
      "A set of airport gates",
      "A single rocket engine",
      "A type of fuel"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "A coordinated group of satellites",
    "category": "Satellite Networks",
    "explanation": "Correct protocol verified: \"A coordinated group of satellites\". Standard classification under Satellite Networks."
  },
  {
    "id": "set3_q36",
    "sequenceId": 136,
    "sourcePdf": "set3.pdf",
    "originalQNum": 36,
    "questionText": "What does remote sensing collect information about?",
    "options": [
      "Company payroll",
      "Earth or objects from a distance",
      "Only indoor temperature",
      "Aircraft ticket prices"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Earth or objects from a distance",
    "category": "Remote Sensing",
    "explanation": "Correct protocol verified: \"Earth or objects from a distance\". Standard classification under Remote Sensing."
  },
  {
    "id": "set3_q37",
    "sequenceId": 137,
    "sourcePdf": "set3.pdf",
    "originalQNum": 37,
    "questionText": "What can Earth-observation satellites monitor?",
    "options": [
      "Restaurant menus",
      "Patent fees",
      "Office attendance only",
      "Weather and land changes"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Weather and land changes",
    "category": "Earth Observation",
    "explanation": "Correct protocol verified: \"Weather and land changes\". Standard classification under Earth Observation."
  },
  {
    "id": "set3_q38",
    "sequenceId": 138,
    "sourcePdf": "set3.pdf",
    "originalQNum": 38,
    "questionText": "What is the boundary often used to mark the start of space called?",
    "options": [
      "Prime meridian",
      "Equator",
      "Kármán line",
      "Tropic line"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Kármán line",
    "category": "Space Boundaries",
    "explanation": "Correct protocol verified: \"Kármán line\". Standard classification under Space Boundaries."
  },
  {
    "id": "set3_q39",
    "sequenceId": 139,
    "sourcePdf": "set3.pdf",
    "originalQNum": 39,
    "questionText": "What is a launch window?",
    "options": [
      "Rocket storage room",
      "Suitable time period for launch",
      "Company funding round",
      "Satellite camera lens"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Suitable time period for launch",
    "category": "Mission Orbital Timing",
    "explanation": "Correct protocol verified: \"Suitable time period for launch\". Standard classification under Mission Orbital Timing."
  },
  {
    "id": "set3_q40",
    "sequenceId": 140,
    "sourcePdf": "set3.pdf",
    "originalQNum": 40,
    "questionText": "What is the stage that places a payload into orbit called?",
    "options": [
      "Market penetration",
      "Patent filing",
      "Orbital insertion",
      "Customer onboarding"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Orbital insertion",
    "category": "Orbital Mechanics",
    "explanation": "Correct protocol verified: \"Orbital insertion\". Standard classification under Orbital Mechanics."
  },
  {
    "id": "set3_q41",
    "sequenceId": 141,
    "sourcePdf": "set3.pdf",
    "originalQNum": 41,
    "questionText": "What is a CubeSat?",
    "options": [
      "A launch tower",
      "A rocket fuel type",
      "A small standardized satellite",
      "An aircraft engine"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "A small standardized satellite",
    "category": "Small Satellites",
    "explanation": "Correct protocol verified: \"A small standardized satellite\". Standard classification under Small Satellites."
  },
  {
    "id": "set3_q42",
    "sequenceId": 142,
    "sourcePdf": "set3.pdf",
    "originalQNum": 42,
    "questionText": "What is a satellite antenna used for?",
    "options": [
      "Cooling runways",
      "Sending or receiving signals",
      "Producing oxygen",
      "Generating gravity"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Sending or receiving signals",
    "category": "Communications Hardware",
    "explanation": "Correct protocol verified: \"Sending or receiving signals\". Standard classification under Communications Hardware."
  },
  {
    "id": "set3_q43",
    "sequenceId": 143,
    "sourcePdf": "set3.pdf",
    "originalQNum": 43,
    "questionText": "What is a spacecraft's heat control system called?",
    "options": [
      "Fuel sales model",
      "Airline booking system",
      "Thermal control system",
      "Market control plan"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Thermal control system",
    "category": "Spacecraft Systems",
    "explanation": "Correct protocol verified: \"Thermal control system\". Standard classification under Spacecraft Systems."
  },
  {
    "id": "set3_q44",
    "sequenceId": 144,
    "sourcePdf": "set3.pdf",
    "originalQNum": 44,
    "questionText": "What is a robotic arm in space used for?",
    "options": [
      "Creating oxygen from nothing",
      "Changing Earth's orbit",
      "Moving or handling objects",
      "Replacing ground control"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Moving or handling objects",
    "category": "Space Robotics",
    "explanation": "Correct protocol verified: \"Moving or handling objects\". Standard classification under Space Robotics."
  },
  {
    "id": "set3_q45",
    "sequenceId": 145,
    "sourcePdf": "set3.pdf",
    "originalQNum": 45,
    "questionText": "What is a lunar mission focused on?",
    "options": [
      "The Sun's surface",
      "Mars's moons only",
      "Deep ocean trenches",
      "Earth's Moon"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Earth's Moon",
    "category": "Lunar Exploration",
    "explanation": "Correct protocol verified: \"Earth's Moon\". Standard classification under Lunar Exploration."
  },
  {
    "id": "set3_q46",
    "sequenceId": 146,
    "sourcePdf": "set3.pdf",
    "originalQNum": 46,
    "questionText": "What is a Mars lander designed to do?",
    "options": [
      "Build commercial airports",
      "Circle Earth only",
      "Monitor stock prices",
      "Reach and study Mars's surface"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Reach and study Mars's surface",
    "category": "Planetary Science",
    "explanation": "Correct protocol verified: \"Reach and study Mars's surface\". Standard classification under Planetary Science."
  },
  {
    "id": "set3_q47",
    "sequenceId": 147,
    "sourcePdf": "set3.pdf",
    "originalQNum": 47,
    "questionText": "What does propulsion do?",
    "options": [
      "Protects trademarks",
      "Produces motion or thrust",
      "Stores customer records",
      "Measures market share"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Produces motion or thrust",
    "category": "Propulsion Principles",
    "explanation": "Correct protocol verified: \"Produces motion or thrust\". Standard classification under Propulsion Principles."
  },
  {
    "id": "set3_q48",
    "sequenceId": 148,
    "sourcePdf": "set3.pdf",
    "originalQNum": 48,
    "questionText": "What is a test of rocket hardware before flight?",
    "options": [
      "Brand audit",
      "Ground test",
      "IPO",
      "Customer churn"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Ground test",
    "category": "Aerospace Testing",
    "explanation": "Correct protocol verified: \"Ground test\". Standard classification under Aerospace Testing."
  },
  {
    "id": "set3_q49",
    "sequenceId": 149,
    "sourcePdf": "set3.pdf",
    "originalQNum": 49,
    "questionText": "What is a launch countdown used for?",
    "options": [
      "Calculate business tax only",
      "Choose a company logo",
      "Track customer reviews",
      "Coordinate launch readiness"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Coordinate launch readiness",
    "category": "Launch Operations",
    "explanation": "Correct protocol verified: \"Coordinate launch readiness\". Standard classification under Launch Operations."
  },
  {
    "id": "set3_q50",
    "sequenceId": 150,
    "sourcePdf": "set3.pdf",
    "originalQNum": 50,
    "questionText": "What is a key goal of sustainable space activity?",
    "options": [
      "Reduce debris and resource waste",
      "Increase orbital clutter",
      "Avoid tracking satellites",
      "Ignore end-of-life plans"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Reduce debris and resource waste",
    "category": "Space Sustainability",
    "explanation": "Correct protocol verified: \"Reduce debris and resource waste\". Standard classification under Space Sustainability."
  },
  {
    "id": "set4_q1",
    "sequenceId": 151,
    "sourcePdf": "set4.pdf",
    "originalQNum": 1,
    "questionText": "What is a fresh solution to a problem called?",
    "options": [
      "Inflation",
      "Innovation",
      "Inventory",
      "Imitation"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Innovation",
    "category": "Innovation Concepts",
    "explanation": "Correct protocol verified: \"Innovation\". Standard classification under Innovation Concepts."
  },
  {
    "id": "set4_q2",
    "sequenceId": 152,
    "sourcePdf": "set4.pdf",
    "originalQNum": 2,
    "questionText": "Which method helps understand users before designing?",
    "options": [
      "Outsourcing",
      "Design thinking",
      "Bookkeeping",
      "Auditing"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Design thinking",
    "category": "Design Methodology",
    "explanation": "Correct protocol verified: \"Design thinking\". Standard classification under Design Methodology."
  },
  {
    "id": "set4_q3",
    "sequenceId": 153,
    "sourcePdf": "set4.pdf",
    "originalQNum": 3,
    "questionText": "What is a test version of a product?",
    "options": [
      "Patent",
      "Invoice",
      "Dividend",
      "Prototype"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Prototype",
    "category": "Product Development",
    "explanation": "Correct protocol verified: \"Prototype\". Standard classification under Product Development."
  },
  {
    "id": "set4_q4",
    "sequenceId": 154,
    "sourcePdf": "set4.pdf",
    "originalQNum": 4,
    "questionText": "What does MVP stand for?",
    "options": [
      "Minimum Viable Product",
      "Market Value Process",
      "Most Valuable Plan",
      "Managed Venture Project"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Minimum Viable Product",
    "category": "Product Management",
    "explanation": "Correct protocol verified: \"Minimum Viable Product\". Standard classification under Product Management."
  },
  {
    "id": "set4_q5",
    "sequenceId": 155,
    "sourcePdf": "set4.pdf",
    "originalQNum": 5,
    "questionText": "What checks whether customers want an idea?",
    "options": [
      "Market validation",
      "Liquidation",
      "Depreciation",
      "Payroll"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Market validation",
    "category": "Market Validation",
    "explanation": "Correct protocol verified: \"Market validation\". Standard classification under Market Validation."
  },
  {
    "id": "set4_q6",
    "sequenceId": 156,
    "sourcePdf": "set4.pdf",
    "originalQNum": 6,
    "questionText": "What is a short investor presentation called?",
    "options": [
      "Pitch deck",
      "User manual",
      "Balance sheet",
      "Purchase order"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Pitch deck",
    "category": "Venture Capital & Pitching",
    "explanation": "Correct protocol verified: \"Pitch deck\". Standard classification under Venture Capital & Pitching."
  },
  {
    "id": "set4_q7",
    "sequenceId": 157,
    "sourcePdf": "set4.pdf",
    "originalQNum": 7,
    "questionText": "Money invested in exchange for company ownership is?",
    "options": [
      "Equity funding",
      "Salary",
      "Sales tax",
      "Rent"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Equity funding",
    "category": "Venture Financing",
    "explanation": "Correct protocol verified: \"Equity funding\". Standard classification under Venture Financing."
  },
  {
    "id": "set4_q8",
    "sequenceId": 158,
    "sourcePdf": "set4.pdf",
    "originalQNum": 8,
    "questionText": "What is funding a business with personal savings?",
    "options": [
      "Franchising",
      "Bootstrapping",
      "Acquisition",
      "Licensing"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Bootstrapping",
    "category": "Venture Financing",
    "explanation": "Correct protocol verified: \"Bootstrapping\". Standard classification under Venture Financing."
  },
  {
    "id": "set4_q9",
    "sequenceId": 159,
    "sourcePdf": "set4.pdf",
    "originalQNum": 9,
    "questionText": "What describes how a business earns money?",
    "options": [
      "Test report",
      "Revenue model",
      "Brand guide",
      "Org chart"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Revenue model",
    "category": "Business Models",
    "explanation": "Correct protocol verified: \"Revenue model\". Standard classification under Business Models."
  },
  {
    "id": "set4_q10",
    "sequenceId": 160,
    "sourcePdf": "set4.pdf",
    "originalQNum": 10,
    "questionText": "What is a startup's planned spending rate called?",
    "options": [
      "Burn rate",
      "Click rate",
      "Churn rate",
      "Tax rate"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Burn rate",
    "category": "Startup Metrics",
    "explanation": "Correct protocol verified: \"Burn rate\". Standard classification under Startup Metrics."
  },
  {
    "id": "set4_q11",
    "sequenceId": 161,
    "sourcePdf": "set4.pdf",
    "originalQNum": 11,
    "questionText": "What protects an invention legally?",
    "options": [
      "Receipt",
      "Invoice",
      "Patent",
      "Warranty"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Patent",
    "category": "Intellectual Property",
    "explanation": "Correct protocol verified: \"Patent\". Standard classification under Intellectual Property."
  },
  {
    "id": "set4_q12",
    "sequenceId": 162,
    "sourcePdf": "set4.pdf",
    "originalQNum": 12,
    "questionText": "What protects a brand name or logo?",
    "options": [
      "Balance sheet",
      "Trademark",
      "Copyright only",
      "Blueprint"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Trademark",
    "category": "Intellectual Property",
    "explanation": "Correct protocol verified: \"Trademark\". Standard classification under Intellectual Property."
  },
  {
    "id": "set4_q13",
    "sequenceId": 163,
    "sourcePdf": "set4.pdf",
    "originalQNum": 13,
    "questionText": "What is a business's key customer benefit?",
    "options": [
      "Value proposition",
      "Staff roster",
      "Cash reserve",
      "Tax return"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Value proposition",
    "category": "Value Proposition",
    "explanation": "Correct protocol verified: \"Value proposition\". Standard classification under Value Proposition."
  },
  {
    "id": "set4_q14",
    "sequenceId": 164,
    "sourcePdf": "set4.pdf",
    "originalQNum": 14,
    "questionText": "What is a major change in business direction called?",
    "options": [
      "Merger",
      "Invoice",
      "Audit",
      "Pivot"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Pivot",
    "category": "Startup Agility",
    "explanation": "Correct protocol verified: \"Pivot\". Standard classification under Startup Agility."
  },
  {
    "id": "set4_q15",
    "sequenceId": 165,
    "sourcePdf": "set4.pdf",
    "originalQNum": 15,
    "questionText": "What is raising funds from many online supporters?",
    "options": [
      "Factoring",
      "Crowdfunding",
      "Bartering",
      "Leasing"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Crowdfunding",
    "category": "Venture Financing",
    "explanation": "Correct protocol verified: \"Crowdfunding\". Standard classification under Venture Financing."
  },
  {
    "id": "set4_q16",
    "sequenceId": 166,
    "sourcePdf": "set4.pdf",
    "originalQNum": 16,
    "questionText": "What does SWOT examine?",
    "options": [
      "Only staffing",
      "Strengths and risks",
      "Only patents",
      "Only sales"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Strengths and risks",
    "category": "Strategic Planning",
    "explanation": "Correct protocol verified: \"Strengths and risks\". Standard classification under Strategic Planning."
  },
  {
    "id": "set4_q17",
    "sequenceId": 167,
    "sourcePdf": "set4.pdf",
    "originalQNum": 17,
    "questionText": "Who supports early startups with mentorship and space?",
    "options": [
      "Warehouse",
      "Auditor",
      "Incubator",
      "Retailer"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Incubator",
    "category": "Startup Incubation",
    "explanation": "Correct protocol verified: \"Incubator\". Standard classification under Startup Incubation."
  },
  {
    "id": "set4_q18",
    "sequenceId": 168,
    "sourcePdf": "set4.pdf",
    "originalQNum": 18,
    "questionText": "What measures profit relative to investment?",
    "options": [
      "CPU",
      "GPS",
      "ROI",
      "CAD"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "ROI",
    "category": "Financial Metrics",
    "explanation": "Correct protocol verified: \"ROI\". Standard classification under Financial Metrics."
  },
  {
    "id": "set4_q19",
    "sequenceId": 169,
    "sourcePdf": "set4.pdf",
    "originalQNum": 19,
    "questionText": "What is selling shares publicly for the first time?",
    "options": [
      "MVP",
      "R&D",
      "IPO",
      "NDA"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "IPO",
    "category": "Capital Markets",
    "explanation": "Correct protocol verified: \"IPO\". Standard classification under Capital Markets."
  },
  {
    "id": "set4_q20",
    "sequenceId": 170,
    "sourcePdf": "set4.pdf",
    "originalQNum": 20,
    "questionText": "What is a specific group of target customers called?",
    "options": [
      "Cost center",
      "Supply chain",
      "Board meeting",
      "Niche market"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Niche market",
    "category": "Market Segmentation",
    "explanation": "Correct protocol verified: \"Niche market\". Standard classification under Market Segmentation."
  },
  {
    "id": "set4_q21",
    "sequenceId": 171,
    "sourcePdf": "set4.pdf",
    "originalQNum": 21,
    "questionText": "What vehicle is commonly used to launch satellites?",
    "options": [
      "Balloon",
      "Rocket",
      "Submarine",
      "Glider"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Rocket",
    "category": "Space Launch",
    "explanation": "Correct protocol verified: \"Rocket\". Standard classification under Space Launch."
  },
  {
    "id": "set4_q22",
    "sequenceId": 172,
    "sourcePdf": "set4.pdf",
    "originalQNum": 22,
    "questionText": "What keeps a spacecraft on a planned path?",
    "options": [
      "Landing gear only",
      "Guidance system",
      "Seat belt",
      "Cabin light"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Guidance system",
    "category": "Avionics & Navigation",
    "explanation": "Correct protocol verified: \"Guidance system\". Standard classification under Avionics & Navigation."
  },
  {
    "id": "set4_q23",
    "sequenceId": 173,
    "sourcePdf": "set4.pdf",
    "originalQNum": 23,
    "questionText": "What is a satellite's path around a body called?",
    "options": [
      "Hangar",
      "Orbit",
      "Runway",
      "Meridian"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Orbit",
    "category": "Orbital Mechanics",
    "explanation": "Correct protocol verified: \"Orbit\". Standard classification under Orbital Mechanics."
  },
  {
    "id": "set4_q24",
    "sequenceId": 174,
    "sourcePdf": "set4.pdf",
    "originalQNum": 24,
    "questionText": "What force pulls objects toward Earth?",
    "options": [
      "Lift",
      "Gravity",
      "Drag",
      "Thrust"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Gravity",
    "category": "Physics & Gravity",
    "explanation": "Correct protocol verified: \"Gravity\". Standard classification under Physics & Gravity."
  },
  {
    "id": "set4_q25",
    "sequenceId": 175,
    "sourcePdf": "set4.pdf",
    "originalQNum": 25,
    "questionText": "What pushes a rocket forward?",
    "options": [
      "Weight",
      "Friction",
      "Thrust",
      "Buoyancy"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Thrust",
    "category": "Rocket Propulsion",
    "explanation": "Correct protocol verified: \"Thrust\". Standard classification under Rocket Propulsion."
  },
  {
    "id": "set4_q26",
    "sequenceId": 176,
    "sourcePdf": "set4.pdf",
    "originalQNum": 26,
    "questionText": "What is the study of flight and aircraft?",
    "options": [
      "Geology",
      "Optics",
      "Aeronautics",
      "Botany"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Aeronautics",
    "category": "Aerospace Sciences",
    "explanation": "Correct protocol verified: \"Aeronautics\". Standard classification under Aerospace Sciences."
  },
  {
    "id": "set4_q27",
    "sequenceId": 177,
    "sourcePdf": "set4.pdf",
    "originalQNum": 27,
    "questionText": "What is the study of vehicles beyond Earth's atmosphere?",
    "options": [
      "Agronomy",
      "Anatomy",
      "Hydrology",
      "Astronautics"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Astronautics",
    "category": "Aerospace Sciences",
    "explanation": "Correct protocol verified: \"Astronautics\". Standard classification under Aerospace Sciences."
  },
  {
    "id": "set4_q28",
    "sequenceId": 178,
    "sourcePdf": "set4.pdf",
    "originalQNum": 28,
    "questionText": "What instrument measures an aircraft's altitude?",
    "options": [
      "Altimeter",
      "Odometer",
      "Compass only",
      "Thermometer"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Altimeter",
    "category": "Flight Instruments",
    "explanation": "Correct protocol verified: \"Altimeter\". Standard classification under Flight Instruments."
  },
  {
    "id": "set4_q29",
    "sequenceId": 179,
    "sourcePdf": "set4.pdf",
    "originalQNum": 29,
    "questionText": "What helps an aircraft generate lift?",
    "options": [
      "Seat rows",
      "Wings",
      "Tail lights",
      "Landing lights"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Wings",
    "category": "Aerodynamics",
    "explanation": "Correct protocol verified: \"Wings\". Standard classification under Aerodynamics."
  },
  {
    "id": "set4_q30",
    "sequenceId": 180,
    "sourcePdf": "set4.pdf",
    "originalQNum": 30,
    "questionText": "What is a small unmanned aircraft often called?",
    "options": [
      "Ferry",
      "Glider train",
      "Tram",
      "Drone"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Drone",
    "category": "Unmanned Systems",
    "explanation": "Correct protocol verified: \"Drone\". Standard classification under Unmanned Systems."
  },
  {
    "id": "set4_q31",
    "sequenceId": 181,
    "sourcePdf": "set4.pdf",
    "originalQNum": 31,
    "questionText": "What is using less material while maintaining strength an example of?",
    "options": [
      "Branding",
      "Bookkeeping",
      "Overproduction",
      "Design optimization"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Design optimization",
    "category": "Structural Engineering",
    "explanation": "Correct protocol verified: \"Design optimization\". Standard classification under Structural Engineering."
  },
  {
    "id": "set4_q32",
    "sequenceId": 182,
    "sourcePdf": "set4.pdf",
    "originalQNum": 32,
    "questionText": "What does R&D mean?",
    "options": [
      "Risk and delivery",
      "Revenue and debt",
      "Review and design",
      "Research and development"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Research and development",
    "category": "R&D Innovation",
    "explanation": "Correct protocol verified: \"Research and development\". Standard classification under R&D Innovation."
  },
  {
    "id": "set4_q33",
    "sequenceId": 183,
    "sourcePdf": "set4.pdf",
    "originalQNum": 33,
    "questionText": "What is a recurring payment for software access called?",
    "options": [
      "Subscription",
      "Patent",
      "Customs duty",
      "Dividend"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Subscription",
    "category": "Software Business Models",
    "explanation": "Correct protocol verified: \"Subscription\". Standard classification under Software Business Models."
  },
  {
    "id": "set4_q34",
    "sequenceId": 184,
    "sourcePdf": "set4.pdf",
    "originalQNum": 34,
    "questionText": "What is a plan for reaching business goals?",
    "options": [
      "Stock label",
      "Flight recorder",
      "User password",
      "Business strategy"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Business strategy",
    "category": "Strategic Planning",
    "explanation": "Correct protocol verified: \"Business strategy\". Standard classification under Strategic Planning."
  },
  {
    "id": "set4_q35",
    "sequenceId": 185,
    "sourcePdf": "set4.pdf",
    "originalQNum": 35,
    "questionText": "What is feedback from early users useful for?",
    "options": [
      "Improving a product",
      "Ending research",
      "Avoiding all testing",
      "Removing customers"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Improving a product",
    "category": "User Experience & Feedback",
    "explanation": "Correct protocol verified: \"Improving a product\". Standard classification under User Experience & Feedback."
  },
  {
    "id": "set4_q36",
    "sequenceId": 186,
    "sourcePdf": "set4.pdf",
    "originalQNum": 36,
    "questionText": "What does a business plan usually include?",
    "options": [
      "Only a logo",
      "Only staff photos",
      "Goals and finances",
      "Only slogans"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Goals and finances",
    "category": "Business Planning",
    "explanation": "Correct protocol verified: \"Goals and finances\". Standard classification under Business Planning."
  },
  {
    "id": "set4_q37",
    "sequenceId": 187,
    "sourcePdf": "set4.pdf",
    "originalQNum": 37,
    "questionText": "What is the process of making more units called?",
    "options": [
      "Pitching",
      "Ideation",
      "Production",
      "Licensing"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Production",
    "category": "Manufacturing & Operations",
    "explanation": "Correct protocol verified: \"Production\". Standard classification under Manufacturing & Operations."
  },
  {
    "id": "set4_q38",
    "sequenceId": 188,
    "sourcePdf": "set4.pdf",
    "originalQNum": 38,
    "questionText": "What is the money left after costs are deducted from revenue?",
    "options": [
      "Inventory",
      "Equity only",
      "Debt",
      "Profit"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Profit",
    "category": "Financial Fundamentals",
    "explanation": "Correct protocol verified: \"Profit\". Standard classification under Financial Fundamentals."
  },
  {
    "id": "set4_q39",
    "sequenceId": 189,
    "sourcePdf": "set4.pdf",
    "originalQNum": 39,
    "questionText": "What is a confidential business formula called?",
    "options": [
      "Public domain",
      "Trade secret",
      "Trademark",
      "Invoice"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Trade secret",
    "category": "Intellectual Property",
    "explanation": "Correct protocol verified: \"Trade secret\". Standard classification under Intellectual Property."
  },
  {
    "id": "set4_q40",
    "sequenceId": 190,
    "sourcePdf": "set4.pdf",
    "originalQNum": 40,
    "questionText": "What is a partnership formed for one project called?",
    "options": [
      "Franchise fee",
      "IPO",
      "Joint venture",
      "Sole proprietorship"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Joint venture",
    "category": "Business Ventures",
    "explanation": "Correct protocol verified: \"Joint venture\". Standard classification under Business Ventures."
  },
  {
    "id": "set4_q41",
    "sequenceId": 191,
    "sourcePdf": "set4.pdf",
    "originalQNum": 41,
    "questionText": "What does a spacecraft use solar panels to generate?",
    "options": [
      "Gravity",
      "Electricity",
      "Sound",
      "Oxygen directly"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Electricity",
    "category": "Spacecraft Energy",
    "explanation": "Correct protocol verified: \"Electricity\". Standard classification under Spacecraft Energy."
  },
  {
    "id": "set4_q42",
    "sequenceId": 192,
    "sourcePdf": "set4.pdf",
    "originalQNum": 42,
    "questionText": "What is a space probe designed to do?",
    "options": [
      "Carry commuters",
      "Control traffic",
      "Farm soil",
      "Explore space remotely"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Explore space remotely",
    "category": "Deep Space Missions",
    "explanation": "Correct protocol verified: \"Explore space remotely\". Standard classification under Deep Space Missions."
  },
  {
    "id": "set4_q43",
    "sequenceId": 193,
    "sourcePdf": "set4.pdf",
    "originalQNum": 43,
    "questionText": "What is a heat shield mainly designed to manage?",
    "options": [
      "Fuel price",
      "Extreme heating",
      "Cabin design",
      "Radio volume"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Extreme heating",
    "category": "Thermal Protection",
    "explanation": "Correct protocol verified: \"Extreme heating\". Standard classification under Thermal Protection."
  },
  {
    "id": "set4_q44",
    "sequenceId": 194,
    "sourcePdf": "set4.pdf",
    "originalQNum": 44,
    "questionText": "What does a rover do on another world?",
    "options": [
      "Moves and studies the surface",
      "Launches satellites",
      "Creates Earth's weather",
      "Builds runways"
    ],
    "correctOptionLetter": "A",
    "correctOptionIndex": 0,
    "correctOptionText": "Moves and studies the surface",
    "category": "Planetary Surface Exploration",
    "explanation": "Correct protocol verified: \"Moves and studies the surface\". Standard classification under Planetary Surface Exploration."
  },
  {
    "id": "set4_q45",
    "sequenceId": 195,
    "sourcePdf": "set4.pdf",
    "originalQNum": 45,
    "questionText": "What is a payload on a rocket?",
    "options": [
      "Launch countdown",
      "Ground crew uniform",
      "Rocket paint",
      "Cargo or equipment carried"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Cargo or equipment carried",
    "category": "Rocket Architecture",
    "explanation": "Correct protocol verified: \"Cargo or equipment carried\". Standard classification under Rocket Architecture."
  },
  {
    "id": "set4_q46",
    "sequenceId": 196,
    "sourcePdf": "set4.pdf",
    "originalQNum": 46,
    "questionText": "What is a reusable launch vehicle designed to do?",
    "options": [
      "Replace all satellites",
      "Work only underwater",
      "Avoid guidance systems",
      "Fly on more than one mission"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Fly on more than one mission",
    "category": "Reusable Rocketry",
    "explanation": "Correct protocol verified: \"Fly on more than one mission\". Standard classification under Reusable Rocketry."
  },
  {
    "id": "set4_q47",
    "sequenceId": 197,
    "sourcePdf": "set4.pdf",
    "originalQNum": 47,
    "questionText": "What is communication between spacecraft and Earth often called?",
    "options": [
      "Crop rotation",
      "Telemetry and tracking",
      "Payroll processing",
      "Retail checkout"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Telemetry and tracking",
    "category": "Telemetry & Tracking",
    "explanation": "Correct protocol verified: \"Telemetry and tracking\". Standard classification under Telemetry & Tracking."
  },
  {
    "id": "set4_q48",
    "sequenceId": 198,
    "sourcePdf": "set4.pdf",
    "originalQNum": 48,
    "questionText": "What is the risk of debris orbiting Earth called?",
    "options": [
      "Supply inflation",
      "Market churn",
      "Space debris risk",
      "Runway congestion"
    ],
    "correctOptionLetter": "C",
    "correctOptionIndex": 2,
    "correctOptionText": "Space debris risk",
    "category": "Orbital Safety",
    "explanation": "Correct protocol verified: \"Space debris risk\". Standard classification under Orbital Safety."
  },
  {
    "id": "set4_q49",
    "sequenceId": 199,
    "sourcePdf": "set4.pdf",
    "originalQNum": 49,
    "questionText": "What is a startup's first group of users often called?",
    "options": [
      "Late suppliers",
      "Board auditors",
      "Tax agents",
      "Early adopters"
    ],
    "correctOptionLetter": "D",
    "correctOptionIndex": 3,
    "correctOptionText": "Early adopters",
    "category": "Adoption Lifecycle",
    "explanation": "Correct protocol verified: \"Early adopters\". Standard classification under Adoption Lifecycle."
  },
  {
    "id": "set4_q50",
    "sequenceId": 200,
    "sourcePdf": "set4.pdf",
    "originalQNum": 50,
    "questionText": "What is a simple drawing of a product layout called?",
    "options": [
      "Invoice",
      "Wireframe",
      "Dividend",
      "Warranty"
    ],
    "correctOptionLetter": "B",
    "correctOptionIndex": 1,
    "correctOptionText": "Wireframe",
    "category": "Product & UI Design",
    "explanation": "Correct protocol verified: \"Wireframe\". Standard classification under Product & UI Design."
  }
];

export const TOTAL_QUESTIONS_IN_BANK = QUESTION_BANK.length; // 200

/**
 * Robust Fisher-Yates shuffle algorithm to select exactly N unique questions without replacement
 */
export function selectRandomQuestions(count: number = 20): QuestionBankItem[] {
  const pool = [...QUESTION_BANK];
  const m = pool.length;
  const targetCount = Math.min(count, m);
  
  // Fisher-Yates shuffle
  for (let i = m - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }
  
  return pool.slice(0, targetCount);
}
