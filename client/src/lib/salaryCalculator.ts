export interface SalaryInput {
  salary: number;
  salaryType: 'gross' | 'net';
  region: 'I' | 'II' | 'III' | 'IV';
  dependents: number;
  year: 2025 | 2026;
}

export interface SalaryBreakdown {
  grossSalary: number;
  
  // Insurance deductions (Employee) - calculated on gross salary
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  totalInsurance: number;
  
  // Income after insurance (before deductions)
  incomeBeforeTax: number;
  
  // Personal deductions (only for tax calculation)
  personalDeduction: number;
  dependentDeduction: number;
  totalDeductions: number;
  
  // Taxable income
  taxableIncome: number;
  
  // PIT calculation
  pit: number;
  pitBreakdown: Array<{
    bracket: number;
    income: number;
    rate: number;
    tax: number;
  }>;
  
  // Net salary
  netSalary: number;
  
  // Employer cost
  employerSocialInsurance: number;
  employerHealthInsurance: number;
  employerUnemploymentInsurance: number;
  totalEmployerCost: number;
  
  // Comparison: old vs new law
  oldLawPIT?: number;
  oldLawNetSalary?: number;
  taxSavings?: number;
  netPercentageChange?: number;
  
  // Year for display
  year?: 2025 | 2026;
}

// Tax brackets 2026 (New 5-level system)
const TAX_BRACKETS_2026 = [
  { min: 0, max: 10_000_000, rate: 0.05 },
  { min: 10_000_001, max: 30_000_000, rate: 0.10 },
  { min: 30_000_001, max: 60_000_000, rate: 0.20 },
  { min: 60_000_001, max: 100_000_000, rate: 0.30 },
  { min: 100_000_001, max: Infinity, rate: 0.35 },
];

// Tax brackets 2025 (Old 7-level system)
const TAX_BRACKETS_2025 = [
  { min: 0, max: 5_000_000, rate: 0.05 },
  { min: 5_000_001, max: 10_000_000, rate: 0.10 },
  { min: 10_000_001, max: 18_000_000, rate: 0.15 },
  { min: 18_000_001, max: 32_000_000, rate: 0.20 },
  { min: 32_000_001, max: 52_000_000, rate: 0.25 },
  { min: 52_000_001, max: 80_000_000, rate: 0.30 },
  { min: 80_000_001, max: Infinity, rate: 0.35 },
];

// Insurance rates (Employee)
const INSURANCE_RATES = {
  socialInsurance: 0.08,
  healthInsurance: 0.015,
  unemploymentInsurance: 0.01,
};

const EMPLOYER_INSURANCE_RATES = {
  socialInsurance: 0.145,
  healthInsurance: 0.03,
  unemploymentInsurance: 0.01,
};

// Deductions by year
const PERSONAL_DEDUCTIONS = {
  2025: 11_000_000,
  2026: 15_500_000,
};

const DEPENDENT_DEDUCTIONS = {
  2025: 4_400_000,
  2026: 6_200_000,
};

/**
 * Calculate progressive tax based on brackets
 */
function calculateProgressiveTax(
  taxableIncome: number,
  brackets: typeof TAX_BRACKETS_2026
): { tax: number; breakdown: Array<{ bracket: number; income: number; rate: number; tax: number }> } {
  let tax = 0;
  const breakdown = [];

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const nextBracketMin = brackets[i + 1]?.min ?? bracket.max + 1;

    if (taxableIncome > bracket.min) {
      const incomeInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      const taxInBracket = incomeInBracket * bracket.rate;
      tax += taxInBracket;

      breakdown.push({
        bracket: i + 1,
        income: incomeInBracket,
        rate: bracket.rate * 100,
        tax: taxInBracket,
      });
    }
  }

  return { tax, breakdown };
}

/**
 * Main salary calculation function
 * 
 * Calculation order (correct per Vietnam law):
 * 1. Start with gross salary
 * 2. Calculate insurance on gross salary
 * 3. Income after insurance (before deductions)
 * 4. Apply personal + dependent deductions to calculate taxable income
 * 5. Apply PIT brackets on taxable income
 * 6. Net salary = Gross - Insurance - PIT
 */
export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const { salary, salaryType, region, dependents, year } = input;

  // Get deduction amounts for the year
  const personalDeduction = PERSONAL_DEDUCTIONS[year];
  const dependentDeduction = DEPENDENT_DEDUCTIONS[year] * Math.max(0, dependents);
  const totalDeductions = personalDeduction + dependentDeduction;

  // Determine gross salary
  let grossSalary = salary;
  if (salaryType === 'net') {
    // If user entered net salary, we need to calculate gross
    // This requires iterative calculation
    grossSalary = calculateGrossFromNet(salary, totalDeductions, year);
  }

  // Insurance deductions (Employee) - calculated on GROSS salary
  const socialInsurance = grossSalary * INSURANCE_RATES.socialInsurance;
  const healthInsurance = grossSalary * INSURANCE_RATES.healthInsurance;
  const unemploymentInsurance = grossSalary * INSURANCE_RATES.unemploymentInsurance;
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  // Income after insurance (before deductions)
  const incomeAfterInsurance = grossSalary - totalInsurance;

  // Taxable income = Income after insurance - Personal/Dependent deductions
  const taxableIncome = Math.max(0, incomeAfterInsurance - totalDeductions);

  // PIT calculation
  const { tax: pit, breakdown: pitBreakdown } = calculateProgressiveTax(
    taxableIncome,
    year === 2026 ? TAX_BRACKETS_2026 : TAX_BRACKETS_2025
  );

  // Net salary (after all deductions, insurance, and tax)
  const netSalary = incomeAfterInsurance - pit;

  // Employer cost (calculated on original gross salary)
  const employerSocialInsurance = grossSalary * EMPLOYER_INSURANCE_RATES.socialInsurance;
  const employerHealthInsurance = grossSalary * EMPLOYER_INSURANCE_RATES.healthInsurance;
  const employerUnemploymentInsurance = grossSalary * EMPLOYER_INSURANCE_RATES.unemploymentInsurance;
  const totalEmployerCost = grossSalary + employerSocialInsurance + employerHealthInsurance + employerUnemploymentInsurance;

  // Calculate old law (2025) for comparison
  let oldLawPIT = 0;
  let oldLawNetSalary = 0;

  if (year === 2026) {
    const { tax: oldTax } = calculateProgressiveTax(taxableIncome, TAX_BRACKETS_2025);
    oldLawPIT = oldTax;
    oldLawNetSalary = incomeAfterInsurance - oldTax;
  }

  const taxSavings = year === 2026 ? (oldLawPIT - pit) : 0;
  const netPercentageChange = year === 2026 && oldLawNetSalary > 0 ? ((netSalary - oldLawNetSalary) / oldLawNetSalary) * 100 : 0;

  return {
    grossSalary,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    totalInsurance,
    incomeBeforeTax: incomeAfterInsurance,
    personalDeduction,
    dependentDeduction,
    totalDeductions,
    taxableIncome,
    pit,
    pitBreakdown,
    netSalary,
    employerSocialInsurance,
    employerHealthInsurance,
    employerUnemploymentInsurance,
    totalEmployerCost,
    oldLawPIT,
    oldLawNetSalary,
    taxSavings,
    netPercentageChange,
    year,
  };
}

/**
 * Calculate gross salary from net salary using iterative approach
 */
function calculateGrossFromNet(
  netSalary: number,
  deductions: number,
  year: 2025 | 2026
): number {
  // Initial estimate
  let gross = netSalary / 0.85; // Rough estimate

  // Iterative refinement
  for (let i = 0; i < 10; i++) {
    const socialInsurance = gross * INSURANCE_RATES.socialInsurance;
    const healthInsurance = gross * INSURANCE_RATES.healthInsurance;
    const unemploymentInsurance = gross * INSURANCE_RATES.unemploymentInsurance;
    const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

    const incomeAfterInsurance = gross - totalInsurance;
    const taxableIncome = Math.max(0, incomeAfterInsurance - deductions);

    const { tax: pit } = calculateProgressiveTax(
      taxableIncome,
      year === 2026 ? TAX_BRACKETS_2026 : TAX_BRACKETS_2025
    );

    const calculatedNet = incomeAfterInsurance - pit;

    if (Math.abs(calculatedNet - netSalary) < 100) {
      return gross;
    }

    // Adjust gross salary
    gross = gross * (netSalary / (calculatedNet || 1));
  }

  return gross;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, language: 'en' | 'vi'): string {
  if (language === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
