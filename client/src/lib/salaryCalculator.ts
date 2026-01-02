/**
 * Vietnam Salary Calculator - Core Logic
 * Based on 2025-2026 Vietnam Labor Law
 * 
 * Design Philosophy: Steampunk-Neo Minimalist
 * - Precision: All calculations follow official Vietnamese tax brackets
 * - Transparency: Breakdown shows every deduction component
 * - Bilingual: Supports English and Vietnamese labels
 */

export interface SalaryInput {
  grossSalary: number;
  region: 'I' | 'II' | 'III' | 'IV';
  dependents: number;
  year: 2025 | 2026;
}

export interface SalaryBreakdown {
  grossSalary: number;
  
  // Insurance deductions (Employee)
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  totalInsurance: number;
  
  // Income before tax
  incomeBeforeTax: number;
  
  // Personal deductions
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

// Minimum wage by region and year
const MINIMUM_WAGE = {
  2025: { I: 4_960_000, II: 4_410_000, III: 3_860_000, IV: 3_450_000 },
  2026: { I: 5_310_000, II: 4_730_000, III: 4_140_000, IV: 3_700_000 },
};

// Insurance rates (Employee)
const INSURANCE_RATES = {
  socialInsurance: 0.08,
  healthInsurance: 0.015,
  unemploymentInsurance: 0.01,
};

// Insurance rates (Employer)
const EMPLOYER_INSURANCE_RATES = {
  socialInsurance: 0.145,
  healthInsurance: 0.03,
  unemploymentInsurance: 0.01,
};

// Deductions
const PERSONAL_DEDUCTION = 11_000_000; // Monthly
const DEPENDENT_DEDUCTION = 4_400_000; // Monthly per dependent

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
 */
export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const { grossSalary, region, dependents, year } = input;

  // Insurance deductions (Employee)
  const socialInsurance = grossSalary * INSURANCE_RATES.socialInsurance;
  const healthInsurance = grossSalary * INSURANCE_RATES.healthInsurance;
  const unemploymentInsurance = grossSalary * INSURANCE_RATES.unemploymentInsurance;
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  // Income before tax
  const incomeBeforeTax = grossSalary - totalInsurance;

  // Personal deductions
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = DEPENDENT_DEDUCTION * Math.max(0, dependents);
  const totalDeductions = personalDeduction + dependentDeduction;

  // Taxable income
  const taxableIncome = Math.max(0, incomeBeforeTax - totalDeductions);

  // PIT calculation (2026 new law)
  const { tax: pit, breakdown: pitBreakdown } = calculateProgressiveTax(
    taxableIncome,
    year === 2026 ? TAX_BRACKETS_2026 : TAX_BRACKETS_2025
  );

  // Net salary
  const netSalary = incomeBeforeTax - pit;

  // Employer cost
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
    oldLawNetSalary = incomeBeforeTax - oldTax;
  }

  const taxSavings = oldLawPIT - pit;
  const netPercentageChange = oldLawNetSalary > 0 ? ((netSalary - oldLawNetSalary) / oldLawNetSalary) * 100 : 0;

  return {
    grossSalary,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    totalInsurance,
    incomeBeforeTax,
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
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, locale: 'en' | 'vi' = 'en'): string {
  if (locale === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
