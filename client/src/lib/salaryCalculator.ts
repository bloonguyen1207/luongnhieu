export type WorkerType = 'employee' | 'freelancerContract' | 'freelancerBusiness';

export interface SalaryInput {
  salary: number;
  salaryType: 'gross' | 'net';
  region: 'I' | 'II' | 'III' | 'IV';
  dependents: number;
  year: 2025 | 2026;
  workerType?: WorkerType;
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

export type PayerType = 'domestic' | 'foreign';
export type FinalizationPeriod = 'monthly' | 'quarterly' | 'annually';

export interface VoluntaryInsuranceConfig {
  bhxhEnabled: boolean;
  bhxhBase: number; // monthly contribution base (₫1.5M to 20× reference level)
  bhytEnabled: boolean;
}

export interface VoluntaryInsuranceCost {
  monthlyBhxh: number;
  monthlyBhyt: number;
  monthlyTotal: number;
  annualTotal: number;
}

export interface FreelancerContractBreakdown {
  mode: 'freelancerContract';
  year: 2025 | 2026;
  payerType: PayerType;
  period: FinalizationPeriod;

  // Monthly view (per-payment withholding)
  monthlyGross: number;
  monthlyWithholding: number; // 10% of monthly gross (if ≥ 2M) — 0 for foreign payer
  monthlyNet: number;

  // Annualized finalization
  annualGross: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeductions: number;
  annualTaxableIncome: number;
  annualFinalPIT: number;
  pitBreakdown: Array<{
    bracket: number;
    income: number;
    rate: number;
    tax: number;
  }>;
  annualWithholdingPaid: number;
  finalizationDelta: number; // positive = refund, negative = owe more
  annualNet: number;
  monthlyNetAfterFinalization: number;

  // Period-scoped numbers (driven by `period`)
  periodGross: number;
  periodWithholding: number;
  periodFinalPIT: number;
  periodWithholdingPaid: number;
  periodFinalizationDelta: number;
  periodNet: number;

  // Voluntary insurance
  voluntaryInsurance: VoluntaryInsuranceCost;
  periodVoluntaryInsurance: number;
  netAfterVoluntary: number; // period net minus voluntary insurance
}

export interface FreelancerBusinessBreakdown {
  mode: 'freelancerBusiness';
  year: 2025 | 2026;
  period: FinalizationPeriod;

  monthlyRevenue: number;
  annualRevenue: number;

  exemptThreshold: number;
  isExempt: boolean;

  // Tax on revenue (services: VAT 5% + PIT 2%)
  vatRate: number;
  pitRate: number;
  monthlyVAT: number;
  monthlyPIT: number;
  monthlyTotalTax: number;
  annualVAT: number;
  annualPIT: number;
  annualTotalTax: number;

  monthlyNet: number;
  annualNet: number;

  // Period-scoped numbers
  periodRevenue: number;
  periodVAT: number;
  periodPIT: number;
  periodTotalTax: number;
  periodNet: number;

  // Voluntary insurance
  voluntaryInsurance: VoluntaryInsuranceCost;
  periodVoluntaryInsurance: number;
  netAfterVoluntary: number;
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

// Freelancer service-contract: 10% PIT withholding on each payment ≥ 2M VND
// (Circular 111/2013/TT-BTC, Article 25)
const FREELANCER_WITHHOLDING_RATE = 0.10;
const FREELANCER_WITHHOLDING_THRESHOLD = 2_000_000;

// Freelancer as registered household business (hộ kinh doanh) — services rate
// Circular 40/2021/TT-BTC Appendix I: services without supplied materials
const HOUSEHOLD_BUSINESS_VAT_RATE = 0.05;
const HOUSEHOLD_BUSINESS_PIT_RATE = 0.02;
// Tax-exempt revenue threshold per Decree 141/2026/ND-CP (effective 2026)
// Raised from 100M (2025) → 1B VND/year
const HOUSEHOLD_BUSINESS_EXEMPT_THRESHOLD = {
  2025: 100_000_000,
  2026: 1_000_000_000,
};

// Voluntary insurance (BHXH tự nguyện + BHYT hộ gia đình)
// Law on Social Insurance 2024 (41/2024/QH15, effective July 2025) — voluntary BHXH covers
// retirement, survivorship, maternity, occupational accident (NOT unemployment).
// Note: BHTN (unemployment) cannot be paid voluntarily under current Vietnam law —
// it is exclusively for those under labor contracts ≥ 1 month per the Employment Law 2025.
export const VOLUNTARY_BHXH_RATE = 0.22;
// Minimum base: rural multidimensional poverty line (₫1.5M/mo, held at this level for 2026)
export const VOLUNTARY_BHXH_MIN_BASE = 1_500_000;
// Reference level "mức tham chiếu" / lương cơ sở currently ₫2.34M (raised from ₫1.8M in July 2024)
export const REFERENCE_LEVEL = 2_340_000;
export const VOLUNTARY_BHXH_MAX_BASE = REFERENCE_LEVEL * 20; // ₫46.8M cap

// Voluntary BHYT for household: 4.5% × reference level (single member here)
export const VOLUNTARY_BHYT_RATE = 0.045;
export const VOLUNTARY_BHYT_MONTHLY = REFERENCE_LEVEL * VOLUNTARY_BHYT_RATE; // ₫105,300

function calculateVoluntaryInsurance(
  config?: VoluntaryInsuranceConfig
): VoluntaryInsuranceCost {
  if (!config) {
    return { monthlyBhxh: 0, monthlyBhyt: 0, monthlyTotal: 0, annualTotal: 0 };
  }
  const clampedBase = Math.min(
    VOLUNTARY_BHXH_MAX_BASE,
    Math.max(VOLUNTARY_BHXH_MIN_BASE, config.bhxhBase || VOLUNTARY_BHXH_MIN_BASE)
  );
  const monthlyBhxh = config.bhxhEnabled ? clampedBase * VOLUNTARY_BHXH_RATE : 0;
  const monthlyBhyt = config.bhytEnabled ? VOLUNTARY_BHYT_MONTHLY : 0;
  const monthlyTotal = monthlyBhxh + monthlyBhyt;
  return {
    monthlyBhxh,
    monthlyBhyt,
    monthlyTotal,
    annualTotal: monthlyTotal * 12,
  };
}

const PERIOD_MONTHS: Record<FinalizationPeriod, number> = {
  monthly: 1,
  quarterly: 3,
  annually: 12,
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

function computeNetFromGross(gross: number, deductions: number, year: 2025 | 2026): number {
  const totalInsuranceRate =
    INSURANCE_RATES.socialInsurance +
    INSURANCE_RATES.healthInsurance +
    INSURANCE_RATES.unemploymentInsurance;
  const incomeAfterInsurance = gross * (1 - totalInsuranceRate);
  const taxableIncome = Math.max(0, incomeAfterInsurance - deductions);
  const { tax: pit } = calculateProgressiveTax(
    taxableIncome,
    year === 2026 ? TAX_BRACKETS_2026 : TAX_BRACKETS_2025
  );
  return incomeAfterInsurance - pit;
}

/**
 * Solve for gross given net via binary search.
 * Net(gross) is monotonically increasing and piecewise linear, so binary search
 * converges to sub-VND precision in ~50 iterations.
 */
function calculateGrossFromNet(
  netSalary: number,
  deductions: number,
  year: 2025 | 2026
): number {
  if (netSalary <= 0) return 0;

  let lo = netSalary;
  // Upper bound: even at the highest 35% bracket, gross < net / (0.895 * 0.65) + buffer
  let hi = netSalary / (0.895 * 0.65) + deductions + 1_000_000;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const calculated = computeNetFromGross(mid, deductions, year);
    if (calculated < netSalary) {
      lo = mid;
    } else {
      hi = mid;
    }
    if (hi - lo < 0.001) break;
  }

  return (lo + hi) / 2;
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
  const { salary, salaryType, dependents, year } = input;

  // Get deduction amounts for the year
  const personalDeduction = PERSONAL_DEDUCTIONS[year];
  const dependentDeduction = DEPENDENT_DEDUCTIONS[year] * Math.max(0, dependents);
  const totalDeductions = personalDeduction + dependentDeduction;

  // Determine gross salary
  let grossSalary = salary;
  if (salaryType === 'net') {
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
 * Freelancer under service contract (hợp đồng dịch vụ).
 *
 * Vietnam law (Circular 111/2013/TT-BTC Article 25):
 * - Each payment ≥ 2M VND → company withholds a flat 10% PIT.
 * - At year-end the freelancer finalizes: annual income is taxed at progressive
 *   rates with personal + dependent deductions. The 10% already withheld is
 *   credited; the freelancer either gets a refund or pays the shortfall.
 * - No mandatory insurance (BHXH/BHYT/BHTN are voluntary).
 */
export function calculateFreelancerContract(
  monthlyGross: number,
  dependents: number,
  year: 2025 | 2026,
  salaryType: 'gross' | 'net' = 'gross',
  payerType: PayerType = 'domestic',
  period: FinalizationPeriod = 'monthly',
  voluntary?: VoluntaryInsuranceConfig
): FreelancerContractBreakdown {
  const personalDeduction = PERSONAL_DEDUCTIONS[year];
  const dependentDeduction = DEPENDENT_DEDUCTIONS[year] * Math.max(0, dependents);
  const annualDeductions = (personalDeduction + dependentDeduction) * 12;

  let gross = monthlyGross;
  if (salaryType === 'net') {
    gross = solveFreelancerContractGross(monthlyGross, payerType);
  }

  // A foreign payer with no Vietnamese tax registration cannot withhold PIT.
  // The freelancer self-declares and pays the full progressive PIT at finalization.
  const monthlyWithholding =
    payerType === 'foreign'
      ? 0
      : gross >= FREELANCER_WITHHOLDING_THRESHOLD
      ? gross * FREELANCER_WITHHOLDING_RATE
      : 0;
  const monthlyNet = gross - monthlyWithholding;

  const annualGross = gross * 12;
  const annualWithholdingPaid = monthlyWithholding * 12;
  const annualTaxableIncome = Math.max(0, annualGross - annualDeductions);
  const { tax: annualFinalPIT, breakdown: pitBreakdown } = calculateProgressiveTax(
    annualTaxableIncome,
    year === 2026 ? TAX_BRACKETS_2026 : TAX_BRACKETS_2025
  );

  // Positive delta = refund (over-withheld); negative = owe more
  const finalizationDelta = annualWithholdingPaid - annualFinalPIT;
  const annualNet = annualGross - annualFinalPIT;
  const monthlyNetAfterFinalization = annualNet / 12;

  // Period-scoped breakdown
  const months = PERIOD_MONTHS[period];
  const periodGross = gross * months;
  const periodWithholding = monthlyWithholding * months;
  const periodFinalPIT = annualFinalPIT * (months / 12);
  const periodWithholdingPaid = annualWithholdingPaid * (months / 12);
  const periodFinalizationDelta = finalizationDelta * (months / 12);
  const periodNet = periodGross - periodFinalPIT;

  const voluntaryInsurance = calculateVoluntaryInsurance(voluntary);
  const periodVoluntaryInsurance = voluntaryInsurance.monthlyTotal * months;
  const netAfterVoluntary = periodNet - periodVoluntaryInsurance;

  return {
    mode: 'freelancerContract',
    year,
    payerType,
    period,
    monthlyGross: gross,
    monthlyWithholding,
    monthlyNet,
    annualGross,
    personalDeduction: personalDeduction * 12,
    dependentDeduction: dependentDeduction * 12,
    totalDeductions: annualDeductions,
    annualTaxableIncome,
    annualFinalPIT,
    pitBreakdown,
    annualWithholdingPaid,
    finalizationDelta,
    annualNet,
    monthlyNetAfterFinalization,
    periodGross,
    periodWithholding,
    periodFinalPIT,
    periodWithholdingPaid,
    periodFinalizationDelta,
    periodNet,
    voluntaryInsurance,
    periodVoluntaryInsurance,
    netAfterVoluntary,
  };
}

function solveFreelancerContractGross(
  monthlyNetAfterWithholding: number,
  payerType: PayerType
): number {
  // Foreign payer: no withholding, net = gross
  if (payerType === 'foreign') return monthlyNetAfterWithholding;
  // Domestic payer per-payment view: net = gross × (1 − 0.10) when gross ≥ 2M
  if (monthlyNetAfterWithholding < FREELANCER_WITHHOLDING_THRESHOLD * 0.9) {
    return monthlyNetAfterWithholding;
  }
  return monthlyNetAfterWithholding / (1 - FREELANCER_WITHHOLDING_RATE);
}

/**
 * Freelancer registered as a household business (hộ kinh doanh) providing services.
 *
 * Vietnam law (2026):
 * - Law on PIT (amended) + Decree 141/2026/ND-CP raised the tax-exempt revenue
 *   threshold to 1 billion VND/year.
 * - Above the threshold: VAT 5% + PIT 2% on revenue (services, per Circular
 *   40/2021/TT-BTC Appendix I).
 * - From 2026 the lump-sum (khoán) method is abolished — self-declare quarterly.
 */
export function calculateFreelancerBusiness(
  monthlyRevenue: number,
  year: 2025 | 2026,
  period: FinalizationPeriod = 'monthly',
  voluntary?: VoluntaryInsuranceConfig
): FreelancerBusinessBreakdown {
  const annualRevenue = monthlyRevenue * 12;
  const exemptThreshold = HOUSEHOLD_BUSINESS_EXEMPT_THRESHOLD[year];
  const isExempt = annualRevenue <= exemptThreshold;

  const monthlyVAT = isExempt ? 0 : monthlyRevenue * HOUSEHOLD_BUSINESS_VAT_RATE;
  const monthlyPIT = isExempt ? 0 : monthlyRevenue * HOUSEHOLD_BUSINESS_PIT_RATE;
  const monthlyTotalTax = monthlyVAT + monthlyPIT;

  const months = PERIOD_MONTHS[period];
  const periodRevenue = monthlyRevenue * months;
  const periodVAT = monthlyVAT * months;
  const periodPIT = monthlyPIT * months;
  const periodTotalTax = monthlyTotalTax * months;
  const periodNet = periodRevenue - periodTotalTax;

  const voluntaryInsurance = calculateVoluntaryInsurance(voluntary);
  const periodVoluntaryInsurance = voluntaryInsurance.monthlyTotal * months;
  const netAfterVoluntary = periodNet - periodVoluntaryInsurance;

  return {
    mode: 'freelancerBusiness',
    year,
    period,
    monthlyRevenue,
    annualRevenue,
    exemptThreshold,
    isExempt,
    vatRate: HOUSEHOLD_BUSINESS_VAT_RATE,
    pitRate: HOUSEHOLD_BUSINESS_PIT_RATE,
    monthlyVAT,
    monthlyPIT,
    monthlyTotalTax,
    annualVAT: monthlyVAT * 12,
    annualPIT: monthlyPIT * 12,
    annualTotalTax: monthlyTotalTax * 12,
    monthlyNet: monthlyRevenue - monthlyTotalTax,
    annualNet: annualRevenue - monthlyTotalTax * 12,
    periodRevenue,
    periodVAT,
    periodPIT,
    periodTotalTax,
    periodNet,
    voluntaryInsurance,
    periodVoluntaryInsurance,
    netAfterVoluntary,
  };
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
