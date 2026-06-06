import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateSalary,
  calculateFreelancerContract,
  calculateFreelancerBusiness,
  formatCurrency,
  SalaryBreakdown,
  FreelancerContractBreakdown,
  FreelancerBusinessBreakdown,
  WorkerType,
  PayerType,
  FinalizationPeriod,
  VoluntaryInsuranceConfig,
  VOLUNTARY_BHXH_MIN_BASE,
  VOLUNTARY_BHXH_MAX_BASE,
  VOLUNTARY_BHYT_MONTHLY,
} from '@/lib/salaryCalculator';
import { t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

// Format number with comma separators for display
function formatNumberInput(value: number): string {
  return value.toLocaleString('en-US');
}

// Parse input value, removing commas
function parseNumberInput(value: string): number {
  return Number(value.replace(/,/g, ''));
}

interface CurrencyInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Standardized currency input with ₫ prefix, comma formatting, and auto-select on focus.
 */
function CurrencyInput({ id, value, onChange, placeholder, ariaLabel, className }: CurrencyInputProps) {
  const [display, setDisplay] = useState<string>(formatNumberInput(value));
  const [focused, setFocused] = useState(false);

  // Keep display in sync when value changes externally (e.g. clamping)
  React.useEffect(() => {
    if (!focused) setDisplay(formatNumberInput(value));
  }, [value, focused]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
        ₫
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        aria-label={ariaLabel}
        onChange={(e) => {
          const input = e.target.value;
          setDisplay(input);
          const parsed = parseNumberInput(input);
          onChange(isNaN(parsed) ? 0 : parsed);
        }}
        onFocus={(e) => {
          setFocused(true);
          e.target.select();
        }}
        onBlur={() => {
          setFocused(false);
          setDisplay(formatNumberInput(value));
        }}
        placeholder={placeholder}
        className={`pl-6 font-mono text-base ${className ?? ''}`}
      />
    </div>
  );
}

interface PillGroupProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ v: T; label: string }>;
  onChange: (v: T) => void;
  ariaLabel?: string;
}

function PillGroup<T extends string>({ value, options, onChange, ariaLabel }: PillGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map(({ v, label }) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`text-xs px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
            value === v
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function SalaryCalculator() {
  const { language } = useLanguage();
  const [salary, setSalary] = useState<number>(10_000_000);
  const [salaryType, setSalaryType] = useState<'gross' | 'net'>('gross');
  const [region, setRegion] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [dependents, setDependents] = useState<number>(0);
  const [year, setYear] = useState<2025 | 2026>(2026);
  const [workerType, setWorkerType] = useState<WorkerType>('employee');
  const [payerType, setPayerType] = useState<PayerType>('domestic');
  const [period, setPeriod] = useState<FinalizationPeriod>('monthly');
  const [bhxhEnabled, setBhxhEnabled] = useState<boolean>(false);
  const [bhxhBase, setBhxhBase] = useState<number>(VOLUNTARY_BHXH_MIN_BASE);
  const [bhytEnabled, setBhytEnabled] = useState<boolean>(false);

  const voluntary: VoluntaryInsuranceConfig = {
    bhxhEnabled,
    bhxhBase,
    bhytEnabled,
  };

  const employeeResult = useMemo<SalaryBreakdown>(() => {
    return calculateSalary({
      salary,
      salaryType,
      region,
      dependents,
      year,
    });
  }, [salary, salaryType, region, dependents, year]);

  const freelancerContractResult = useMemo<FreelancerContractBreakdown>(() => {
    return calculateFreelancerContract(salary, dependents, year, salaryType, payerType, period, voluntary);
  }, [salary, salaryType, dependents, year, payerType, period, bhxhEnabled, bhxhBase, bhytEnabled]);

  const freelancerBusinessResult = useMemo<FreelancerBusinessBreakdown>(() => {
    return calculateFreelancerBusiness(salary, year, period, voluntary);
  }, [salary, year, period, bhxhEnabled, bhxhBase, bhytEnabled]);

  const handleReset = () => {
    setSalary(10_000_000);
    setSalaryType('gross');
    setRegion('I');
    setDependents(0);
    setYear(2026);
    setWorkerType('employee');
    setPayerType('domestic');
    setPeriod('monthly');
    setBhxhEnabled(false);
    setBhxhBase(VOLUNTARY_BHXH_MIN_BASE);
    setBhytEnabled(false);
  };

  const handleBhxhBaseChange = (raw: number) => {
    setBhxhBase(raw);
  };
  // Clamped value used for both calculation and feedback display
  const bhxhBaseClamped = Math.min(
    VOLUNTARY_BHXH_MAX_BASE,
    Math.max(VOLUNTARY_BHXH_MIN_BASE, bhxhBase || VOLUNTARY_BHXH_MIN_BASE)
  );
  const bhxhBelowFloor = bhxhEnabled && bhxhBase > 0 && bhxhBase < VOLUNTARY_BHXH_MIN_BASE;
  const bhxhAboveCap = bhxhEnabled && bhxhBase > VOLUNTARY_BHXH_MAX_BASE;

  const isFreelancer = workerType !== 'employee';
  const showNetGrossToggle = workerType !== 'freelancerBusiness';

  const salaryLabel =
    workerType === 'freelancerContract'
      ? t('monthlyPayment', language)
      : workerType === 'freelancerBusiness'
      ? t('monthlyRevenue', language)
      : t('salary', language);

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="p-6 border-l-4 border-l-accent">
        <h2 className="text-2xl font-mono font-bold mb-6 text-foreground">
          {t('calculator', language)}
        </h2>

        {/* Worker Type Toggle */}
        <div className="mb-6">
          <Label id="worker-type-label" className="text-sm font-medium block mb-2">
            {t('workerType', language)}
          </Label>
          <PillGroup<WorkerType>
            label="worker-type-label"
            ariaLabel={t('workerType', language)}
            value={workerType}
            onChange={setWorkerType}
            options={[
              { v: 'employee', label: t('workerTypeEmployee', language) },
              { v: 'freelancerContract', label: t('workerTypeFreelancerContract', language) },
              { v: 'freelancerBusiness', label: t('workerTypeFreelancerBusiness', language) },
            ]}
          />
          <p className="text-xs text-muted-foreground mt-2">{t('workerTypeHint', language)}</p>
        </div>

        {/* Payer Type Toggle (only for Service Contract) */}
        {workerType === 'freelancerContract' && (
          <div className="mb-6">
            <Label className="text-sm font-medium block mb-2">{t('payerType', language)}</Label>
            <PillGroup<PayerType>
              label="payer-type"
              ariaLabel={t('payerType', language)}
              value={payerType}
              onChange={setPayerType}
              options={[
                { v: 'domestic', label: t('payerTypeDomestic', language) },
                { v: 'foreign', label: t('payerTypeForeign', language) },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-2">{t('payerTypeHint', language)}</p>
          </div>
        )}

        {/* Finalization Period (freelancer only) */}
        {isFreelancer && (
          <div className="mb-6">
            <Label className="text-sm font-medium block mb-2">{t('finalizationPeriod', language)}</Label>
            <PillGroup<FinalizationPeriod>
              label="period"
              ariaLabel={t('finalizationPeriod', language)}
              value={period}
              onChange={setPeriod}
              options={[
                { v: 'monthly', label: t('periodMonthly', language) },
                { v: 'quarterly', label: t('periodQuarterly', language) },
                { v: 'annually', label: t('periodAnnually', language) },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-2">{t('periodHint', language)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Input */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">
              {salaryLabel}
            </Label>
            <CurrencyInput
              id="salary"
              value={salary}
              onChange={setSalary}
              placeholder={t('grossSalaryPlaceholder', language)}
              ariaLabel={salaryLabel}
            />
            {showNetGrossToggle && (
              <PillGroup<'gross' | 'net'>
                label="salary-type"
                ariaLabel={salaryLabel}
                value={salaryType}
                onChange={setSalaryType}
                options={[
                  { v: 'gross', label: language === 'en' ? 'Gross' : 'Trước thuế' },
                  { v: 'net', label: language === 'en' ? 'Net' : 'Ròng' },
                ]}
              />
            )}
          </div>

          {/* Region (only relevant to employee for minimum wage display) */}
          {!isFreelancer && (
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium">
                {t('region', language)}
              </Label>
              <Select value={region} onValueChange={(value: any) => setRegion(value)}>
                <SelectTrigger id="region" className="font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">{t('regionI', language)}</SelectItem>
                  <SelectItem value="II">{t('regionII', language)}</SelectItem>
                  <SelectItem value="III">{t('regionIII', language)}</SelectItem>
                  <SelectItem value="IV">{t('regionIV', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dependents (only meaningful when PIT brackets apply: employee or service contract) */}
          {workerType !== 'freelancerBusiness' && (
            <div className="space-y-2">
              <Label htmlFor="dependents" className="text-sm font-medium">
                {t('dependents', language)}
              </Label>
              <Input
                id="dependents"
                type="text"
                inputMode="numeric"
                value={dependents.toString()}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setDependents(Math.min(10, Math.max(0, Number(v || 0))));
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className="font-mono text-base"
              />
              <p className="text-xs text-muted-foreground">{t('dependentsHint', language)}</p>
            </div>
          )}

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              {t('taxLawYear', language)}
            </Label>
            <Select value={year.toString()} onValueChange={(value) => setYear(Number(value) as 2025 | 2026)}>
              <SelectTrigger id="year" className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">{t('year2025', language)}</SelectItem>
                <SelectItem value="2026">{t('year2026', language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Voluntary Insurance (freelancer only) */}
        {isFreelancer && (
          <div className="mt-6 p-4 border border-border rounded-md bg-secondary/30">
            <h3 className="text-sm font-semibold mb-1">{t('voluntaryInsuranceTitle', language)}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {t('voluntaryInsuranceDescription', language)}
            </p>

            <div className="space-y-4">
              {/* BHXH */}
              <div className="space-y-2">
                <label htmlFor="bhxh-enabled" className="flex items-center justify-between gap-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      id="bhxh-enabled"
                      type="checkbox"
                      checked={bhxhEnabled}
                      onChange={(e) => setBhxhEnabled(e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">{t('voluntaryBhxhEnabled', language)}</span>
                  </div>
                  {bhxhEnabled && (
                    <span className="text-sm font-mono font-semibold text-accent">
                      {formatCurrency(bhxhBaseClamped * 0.22, language)}
                      <span className="text-xs text-muted-foreground ml-1">{t('perMonthLabel', language)}</span>
                    </span>
                  )}
                </label>
                {bhxhEnabled && (
                  <div className="ml-7 space-y-1">
                    <Label htmlFor="bhxhBase" className="text-xs">
                      {t('voluntaryBhxhBase', language)}
                    </Label>
                    <CurrencyInput
                      id="bhxhBase"
                      value={bhxhBase}
                      onChange={handleBhxhBaseChange}
                      ariaLabel={t('voluntaryBhxhBase', language)}
                      className="text-sm"
                    />
                    {bhxhBelowFloor && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {t('bhxhBaseClampedMin', language)}
                      </p>
                    )}
                    {bhxhAboveCap && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {t('bhxhBaseClampedMax', language)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t('voluntaryBhxhBaseHint', language)}
                    </p>
                  </div>
                )}
              </div>

              {/* BHYT */}
              <div>
                <label htmlFor="bhyt-enabled" className="flex items-center justify-between gap-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      id="bhyt-enabled"
                      type="checkbox"
                      checked={bhytEnabled}
                      onChange={(e) => setBhytEnabled(e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">{t('voluntaryBhytEnabled', language)}</span>
                  </div>
                  {bhytEnabled && (
                    <span className="text-sm font-mono font-semibold text-accent">
                      {formatCurrency(VOLUNTARY_BHYT_MONTHLY, language)}
                      <span className="text-xs text-muted-foreground ml-1">{t('perMonthLabel', language)}</span>
                    </span>
                  )}
                </label>
                <p className="ml-7 text-xs text-muted-foreground mt-1">
                  {t('voluntaryBhytHint', language)}
                </p>
              </div>

              <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
                {t('bhtnNotAvailable', language)}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 pt-6 border-t border-border">
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="font-mono text-xs"
          >
            ↻ {t('reset', language)}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {workerType === 'employee' && <SalaryResults result={employeeResult} language={language} />}
      {workerType === 'freelancerContract' && (
        <FreelancerContractResults result={freelancerContractResult} language={language} />
      )}
      {workerType === 'freelancerBusiness' && (
        <FreelancerBusinessResults result={freelancerBusinessResult} language={language} />
      )}
    </div>
  );
}

interface SalaryResultsProps {
  result: SalaryBreakdown;
  language: 'en' | 'vi';
}

function SalaryResults({ result, language }: SalaryResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['breakdown']));

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  return (
    <div className="space-y-4">
      {/* Net Salary Highlight */}
      <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('heroTakeHome', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.netSalary, language)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {t('periodMonthly', language)}
            </span>
            <span className="text-xs text-muted-foreground">{t('heroAfterAllTaxes', language)}</span>
          </div>
        </div>
      </Card>

      {/* Breakdown Section */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          aria-expanded={expandedSections.has('breakdown')}
        >
          <h3 className="text-lg font-mono font-bold">{t('salaryBreakdown', language)}</h3>
          <span className="text-2xl text-muted-foreground" aria-hidden>
            {expandedSections.has('breakdown') ? '−' : '+'}
          </span>
        </button>

        {expandedSections.has('breakdown') && (
          <div className="space-y-3 pt-4 border-t border-border">
            <ResultRow
              label={t('grossSalary', language)}
              value={result.grossSalary}
              language={language}
            />
            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('personalDeductionLabel', language)}
              value={-result.personalDeduction}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('dependentDeductionLabel', language)}
              value={-result.dependentDeduction}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('totalDeductionsLabel', language)}
              value={-(result.personalDeduction + result.dependentDeduction)}
              language={language}
              isDeduction
              isBold
            />
            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('socialInsuranceLabel', language)}
              value={-result.socialInsurance}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('healthInsuranceLabel', language)}
              value={-result.healthInsurance}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('unemploymentInsuranceLabel', language)}
              value={-result.unemploymentInsurance}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('totalInsuranceLabel', language)}
              value={-result.totalInsurance}
              language={language}
              isDeduction
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('taxableIncomeLabel', language)}
              value={result.taxableIncome}
              language={language}
            />
            <ResultRow
              label={t('personalIncomeTaxLabel', language)}
              value={-result.pit}
              language={language}
              isDeduction
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('netSalaryTakeHome', language)}
              value={result.netSalary}
              language={language}
              isBold
            />
          </div>
        )}
      </Card>

      {/* PIT Bracket detail (Employee) */}
      {result.pitBreakdown.length > 0 && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('brackets')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('brackets')}
          >
            <h3 className="text-lg font-mono font-bold">{t('pitBracketDetail', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('brackets') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('brackets') && (
            <BracketTable breakdown={result.pitBreakdown} total={result.pit} language={language} />
          )}
        </Card>
      )}

      {/* Employer Cost Section */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('employer')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          aria-expanded={expandedSections.has('employer')}
        >
          <h3 className="text-lg font-mono font-bold">{t('employerCostBreakdown', language)}</h3>
          <span className="text-2xl text-muted-foreground" aria-hidden>
            {expandedSections.has('employer') ? '−' : '+'}
          </span>
        </button>

        {expandedSections.has('employer') && (
          <div className="space-y-3 pt-4 border-t border-border">
            <ResultRow
              label={t('grossSalary', language)}
              value={result.grossSalary}
              language={language}
            />
            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('employerSocialInsuranceLabel', language)}
              value={result.employerSocialInsurance}
              language={language}
            />
            <ResultRow
              label={t('employerHealthInsuranceLabel', language)}
              value={result.employerHealthInsurance}
              language={language}
            />
            <ResultRow
              label={t('employerUnemploymentInsuranceLabel', language)}
              value={result.employerUnemploymentInsurance}
              language={language}
            />
            <ResultRow
              label={t('totalEmployerContributionLabel', language)}
              value={result.employerSocialInsurance + result.employerHealthInsurance + result.employerUnemploymentInsurance}
              language={language}
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('totalEmployerCostLabel', language)}
              value={result.totalEmployerCost}
              language={language}
              isBold
            />
          </div>
        )}
      </Card>

      {/* Comparison Section */}
      {(result as any).year === 2026 && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('comparison')}
          >
            <h3 className="text-lg font-mono font-bold">{t('taxLawComparison', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('comparison') ? '−' : '+'}
            </span>
          </button>

          {expandedSections.has('comparison') && (
            <div className="space-y-3 pt-4 border-t border-border">
              <ResultRow
                label={t('oldLawPIT', language)}
                value={-(result.oldLawPIT ?? 0)}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('personalIncomeTaxLabel', language)}
                value={-result.pit}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('taxSavingsLabel', language)}
                value={result.taxSavings ?? 0}
                language={language}
                isBold
              />

              <div className="my-2 border-t border-border" />

              <ResultRow
                label={t('oldLawNetSalaryLabel', language)}
                value={result.oldLawNetSalary ?? 0}
                language={language}
              />
              <ResultRow
                label={t('netSalaryTakeHome', language)}
                value={result.netSalary}
                language={language}
              />
              <ResultRow
                label={t('percentageIncreaseLabel', language)}
                value={result.netPercentageChange ?? 0}
                language={language}
                isPercentage
                isBold
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

interface FreelancerContractResultsProps {
  result: FreelancerContractBreakdown;
  language: 'en' | 'vi';
}

function FreelancerContractResults({ result, language }: FreelancerContractResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['period', 'voluntary', 'annual', 'comparison', 'brackets'])
  );
  const toggleSection = (s: string) => {
    const next = new Set(expandedSections);
    if (next.has(s)) next.delete(s); else next.add(s);
    setExpandedSections(next);
  };

  const isForeign = result.payerType === 'foreign';
  const refundPositive = result.finalizationDelta >= 0;
  const periodKey =
    result.period === 'monthly'
      ? 'periodMonthly'
      : result.period === 'quarterly'
      ? 'periodQuarterly'
      : 'periodAnnually';
  const hasVoluntary = result.voluntaryInsurance.monthlyTotal > 0;
  const isAnnualView = result.period === 'annually';
  const heroSubLabel = isForeign
    ? t('heroSelfDeclared', language)
    : t('heroAfterAllTaxes', language);
  const taxSavingsPositive = (result.taxSavings ?? 0) >= 0;

  return (
    <div className="space-y-4">
      <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('heroTakeHome', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.netAfterVoluntary, language)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {t(periodKey, language)}
            </span>
            <span className="text-xs text-muted-foreground">{heroSubLabel}</span>
          </div>
        </div>
      </Card>

      {/* Context blurb */}
      <Card className="p-4 border-l-4 border-l-primary bg-secondary/20">
        <p className="text-xs text-muted-foreground">
          {isForeign
            ? t('freelancerContractDescriptionForeign', language)
            : t('freelancerContractDescription', language)}
        </p>
      </Card>

      {/* Summary card — always shown */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('period')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          aria-expanded={expandedSections.has('period')}
        >
          <h3 className="text-lg font-mono font-bold">
            {t('summaryTitle', language)} · {t(periodKey, language)}
          </h3>
          <span className="text-2xl text-muted-foreground" aria-hidden>
            {expandedSections.has('period') ? '−' : '+'}
          </span>
        </button>
        {expandedSections.has('period') && (
          <div className="space-y-3 pt-4 border-t border-border">
            <ResultRow
              label={t('grossThisPeriod', language)}
              value={result.periodGross}
              language={language}
            />
            {!isForeign && (
              <ResultRow
                label={t('withholdingThisPeriod', language)}
                value={-result.periodWithholding}
                language={language}
                isDeduction
              />
            )}
            <ResultRow
              label={t('pitThisPeriod', language)}
              value={-result.periodFinalPIT}
              language={language}
              isDeduction
              isBold
            />
            {hasVoluntary && (
              <ResultRow
                label={t('voluntaryInsuranceThisPeriod', language)}
                value={-result.periodVoluntaryInsurance}
                language={language}
                isDeduction
              />
            )}
            <div className="my-2 border-t border-border" />
            <ResultRow
              label={t('netThisPeriod', language)}
              value={result.netAfterVoluntary}
              language={language}
              isBold
            />
          </div>
        )}
      </Card>

      {/* Voluntary insurance card */}
      {hasVoluntary && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('voluntary')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('voluntary')}
          >
            <h3 className="text-lg font-mono font-bold">{t('voluntaryInsuranceTitle', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('voluntary') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('voluntary') && (
            <div className="space-y-3 pt-4 border-t border-border">
              {result.voluntaryInsurance.monthlyBhxh > 0 && (
                <ResultRow
                  label={t('voluntaryBhxhLabel', language)}
                  value={-result.voluntaryInsurance.monthlyBhxh}
                  language={language}
                  isDeduction
                />
              )}
              {result.voluntaryInsurance.monthlyBhyt > 0 && (
                <ResultRow
                  label={t('voluntaryBhytLabel', language)}
                  value={-result.voluntaryInsurance.monthlyBhyt}
                  language={language}
                  isDeduction
                />
              )}
              <ResultRow
                label={t('voluntaryInsuranceTotalLabel', language)}
                value={-result.voluntaryInsurance.monthlyTotal}
                language={language}
                isDeduction
                isBold
              />
              <p className="text-xs text-muted-foreground italic mt-2">
                {t('bhtnNotAvailable', language)}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Annual Tax Finalization — hidden when Summary already shows annual */}
      {!isAnnualView && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('annual')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('annual')}
          >
            <h3 className="text-lg font-mono font-bold">{t('annualFinalization', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('annual') ? '−' : '+'}
            </span>
          </button>

          {expandedSections.has('annual') && (
            <div className="space-y-3 pt-4 border-t border-border">
              <ResultRow
                label={t('annualGross', language)}
                value={result.annualGross}
                language={language}
              />
              <ResultRow
                label={t('annualPersonalDeduction', language)}
                value={-result.personalDeduction}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('annualDependentDeduction', language)}
                value={-result.dependentDeduction}
                language={language}
                isDeduction
              />
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={t('annualTaxableIncome', language)}
                value={result.annualTaxableIncome}
                language={language}
              />
              <ResultRow
                label={isForeign ? t('annualPITOwed', language) : t('annualFinalPIT', language)}
                value={-result.annualFinalPIT}
                language={language}
                isDeduction
                isBold
              />
              {!isForeign && (
                <>
                  <ResultRow
                    label={t('annualWithholdingPaid', language)}
                    value={result.annualWithholdingPaid}
                    language={language}
                  />
                  <div className="my-2 border-t border-border" />
                  <ResultRow
                    label={refundPositive ? t('finalizationRefund', language) : t('finalizationOwed', language)}
                    value={Math.abs(result.finalizationDelta) * (refundPositive ? 1 : -1)}
                    language={language}
                    isBold
                    isDeduction={!refundPositive}
                  />
                </>
              )}
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={t('heroFinalizationNet', language)}
                value={result.annualNet}
                language={language}
                isBold
              />
              <ResultRow
                label={t('monthlyNetEffective', language)}
                value={result.monthlyNetAfterFinalization}
                language={language}
                isBold
              />
              <p className="text-xs text-muted-foreground mt-2">
                {isForeign
                  ? t('freelancerContractFooterForeign', language)
                  : t('freelancerContractFooter', language)}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* PIT bracket breakdown */}
      {result.pitBreakdown.length > 0 && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('brackets')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('brackets')}
          >
            <h3 className="text-lg font-mono font-bold">{t('pitBracketDetail', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('brackets') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('brackets') && (
            <BracketTable breakdown={result.pitBreakdown} total={result.annualFinalPIT} language={language} />
          )}
        </Card>
      )}

      {/* 2025 vs 2026 comparison */}
      {result.year === 2026 && result.oldLawAnnualPIT !== undefined && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('comparison')}
          >
            <h3 className="text-lg font-mono font-bold">{t('freelancerComparisonTitle', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('comparison') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('comparison') && (
            <div className="space-y-3 pt-4 border-t border-border">
              <ResultRow
                label={t('oldLawAnnualTax', language)}
                value={-(result.oldLawAnnualPIT ?? 0)}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('newLawAnnualTax', language)}
                value={-result.annualFinalPIT}
                language={language}
                isDeduction
              />
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={taxSavingsPositive ? t('youSaveAnnually', language) : t('youPayMoreAnnually', language)}
                value={Math.abs(result.taxSavings ?? 0) * (taxSavingsPositive ? 1 : -1)}
                language={language}
                isBold
                isDeduction={!taxSavingsPositive}
              />
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={t('oldLawAnnualNet', language)}
                value={result.oldLawAnnualNet ?? 0}
                language={language}
              />
              <ResultRow
                label={t('newLawAnnualNet', language)}
                value={result.annualNet}
                language={language}
                isBold
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

interface BracketTableProps {
  breakdown: Array<{ bracket: number; income: number; rate: number; tax: number }>;
  total: number;
  language: 'en' | 'vi';
}

function BracketTable({ breakdown, total, language }: BracketTableProps) {
  return (
    <div className="pt-4 border-t border-border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2 pr-4 font-medium text-muted-foreground">{t('bracketCol', language)}</th>
            <th className="py-2 pr-4 font-medium text-muted-foreground">{t('bracketRate', language)}</th>
            <th className="py-2 pr-4 font-medium text-muted-foreground text-right">{t('bracketIncome', language)}</th>
            <th className="py-2 font-medium text-muted-foreground text-right">{t('bracketTax', language)}</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row) => (
            <tr key={row.bracket} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono">{row.bracket}</td>
              <td className="py-2 pr-4 font-mono">{row.rate.toFixed(0)}%</td>
              <td className="py-2 pr-4 font-mono text-right">{formatCurrency(row.income, language)}</td>
              <td className="py-2 font-mono text-right text-destructive">{formatCurrency(row.tax, language)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-2 pr-4 font-bold" colSpan={3}>{t('bracketTotal', language)}</td>
            <td className="py-2 font-mono text-right font-bold text-destructive">{formatCurrency(total, language)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface FreelancerBusinessResultsProps {
  result: FreelancerBusinessBreakdown;
  language: 'en' | 'vi';
}

function FreelancerBusinessResults({ result, language }: FreelancerBusinessResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['breakdown', 'period', 'voluntary', 'comparison'])
  );
  const toggleSection = (s: string) => {
    const next = new Set(expandedSections);
    if (next.has(s)) next.delete(s); else next.add(s);
    setExpandedSections(next);
  };

  const periodKey =
    result.period === 'monthly'
      ? 'periodMonthly'
      : result.period === 'quarterly'
      ? 'periodQuarterly'
      : 'periodAnnually';
  const hasVoluntary = result.voluntaryInsurance.monthlyTotal > 0;
  const taxSavingsPositive = (result.taxSavings ?? 0) >= 0;

  return (
    <div className="space-y-4">
      <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('heroTakeHome', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.netAfterVoluntary, language)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {t(periodKey, language)}
            </span>
            <span className="text-xs text-muted-foreground">
              {result.isExempt ? t('exemptStatus', language) : t('notExemptStatus', language)}
            </span>
          </div>
        </div>
      </Card>

      {/* Per-period card */}
      {result.period !== 'monthly' && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('period')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          >
            <h3 className="text-lg font-mono font-bold">
              {t('perPeriod', language)} · {t(periodKey, language)}
            </h3>
            <span className="text-2xl text-muted-foreground">
              {expandedSections.has('period') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('period') && (
            <div className="space-y-3 pt-4 border-t border-border">
              <ResultRow
                label={t('revenueThisPeriod', language)}
                value={result.periodRevenue}
                language={language}
              />
              <ResultRow
                label={t('vatThisPeriod', language)}
                value={-result.periodVAT}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('businessPITThisPeriod', language)}
                value={-result.periodPIT}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('totalTaxThisPeriod', language)}
                value={-result.periodTotalTax}
                language={language}
                isDeduction
                isBold
              />
              {hasVoluntary && (
                <ResultRow
                  label={t('voluntaryInsuranceThisPeriod', language)}
                  value={-result.periodVoluntaryInsurance}
                  language={language}
                  isDeduction
                />
              )}
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={t('netThisPeriod', language)}
                value={result.netAfterVoluntary}
                language={language}
                isBold
              />
            </div>
          )}
        </Card>
      )}

      {/* Voluntary insurance card */}
      {hasVoluntary && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('voluntary')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          >
            <h3 className="text-lg font-mono font-bold">{t('voluntaryInsuranceTitle', language)}</h3>
            <span className="text-2xl text-muted-foreground">
              {expandedSections.has('voluntary') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('voluntary') && (
            <div className="space-y-3 pt-4 border-t border-border">
              {result.voluntaryInsurance.monthlyBhxh > 0 && (
                <ResultRow
                  label={t('voluntaryBhxhLabel', language)}
                  value={-result.voluntaryInsurance.monthlyBhxh}
                  language={language}
                  isDeduction
                />
              )}
              {result.voluntaryInsurance.monthlyBhyt > 0 && (
                <ResultRow
                  label={t('voluntaryBhytLabel', language)}
                  value={-result.voluntaryInsurance.monthlyBhyt}
                  language={language}
                  isDeduction
                />
              )}
              <ResultRow
                label={t('voluntaryInsuranceTotalLabel', language)}
                value={-result.voluntaryInsurance.monthlyTotal}
                language={language}
                isDeduction
                isBold
              />
              <p className="text-xs text-muted-foreground italic mt-2">
                {t('bhtnNotAvailable', language)}
              </p>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          aria-expanded={expandedSections.has('breakdown')}
        >
          <h3 className="text-lg font-mono font-bold">{t('freelancerBusinessTitle', language)}</h3>
          <span className="text-2xl text-muted-foreground" aria-hidden>
            {expandedSections.has('breakdown') ? '−' : '+'}
          </span>
        </button>

        {expandedSections.has('breakdown') && (
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {t('freelancerBusinessDescription', language)}
            </p>

            <ResultRow
              label={t('annualRevenue', language)}
              value={result.annualRevenue}
              language={language}
            />
            <ResultRow
              label={t('exemptThreshold', language)}
              value={result.exemptThreshold}
              language={language}
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('vatThisPeriod', language)}
              value={-result.periodVAT}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('businessPITThisPeriod', language)}
              value={-result.periodPIT}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('totalTaxThisPeriod', language)}
              value={-result.periodTotalTax}
              language={language}
              isDeduction
              isBold
            />
            {hasVoluntary && (
              <ResultRow
                label={t('voluntaryInsuranceThisPeriod', language)}
                value={-result.periodVoluntaryInsurance}
                language={language}
                isDeduction
              />
            )}

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('netThisPeriod', language)}
              value={result.netAfterVoluntary}
              language={language}
              isBold
            />

            <p className="text-xs text-muted-foreground mt-2">
              {t('freelancerBusinessFooter', language)}
            </p>
          </div>
        )}
      </Card>

      {/* 2025 vs 2026 comparison */}
      {result.year === 2026 && result.oldLawAnnualTax !== undefined && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.has('comparison')}
          >
            <h3 className="text-lg font-mono font-bold">{t('freelancerComparisonTitle', language)}</h3>
            <span className="text-2xl text-muted-foreground" aria-hidden>
              {expandedSections.has('comparison') ? '−' : '+'}
            </span>
          </button>
          {expandedSections.has('comparison') && (
            <div className="space-y-3 pt-4 border-t border-border">
              {result.isExempt && result.oldLawIsExempt ? (
                <p className="text-xs text-muted-foreground">{t('bothExemptNote', language)}</p>
              ) : result.isExempt && !result.oldLawIsExempt ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {t('oldThresholdNote', language)}
                </p>
              ) : null}
              <ResultRow
                label={t('oldLawAnnualTax', language)}
                value={-(result.oldLawAnnualTax ?? 0)}
                language={language}
                isDeduction
              />
              <ResultRow
                label={t('newLawAnnualTax', language)}
                value={-result.annualTotalTax}
                language={language}
                isDeduction
              />
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={taxSavingsPositive ? t('youSaveAnnually', language) : t('youPayMoreAnnually', language)}
                value={Math.abs(result.taxSavings ?? 0) * (taxSavingsPositive ? 1 : -1)}
                language={language}
                isBold
                isDeduction={!taxSavingsPositive}
              />
              <div className="my-2 border-t border-border" />
              <ResultRow
                label={t('oldLawAnnualNet', language)}
                value={result.oldLawAnnualNet ?? 0}
                language={language}
              />
              <ResultRow
                label={t('newLawAnnualNet', language)}
                value={result.annualNet}
                language={language}
                isBold
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: number;
  language: 'en' | 'vi';
  isDeduction?: boolean;
  isBold?: boolean;
  isPercentage?: boolean;
}

function ResultRow({ label, value, language, isDeduction, isBold, isPercentage }: ResultRowProps) {
  return (
    <div className={`flex justify-between items-center ${isBold ? 'font-bold' : ''}`}>
      <span className="text-sm text-foreground">{label}</span>
      <span className={`text-sm font-mono ${isDeduction ? 'text-destructive' : 'text-foreground'}`}>
        {isPercentage ? `${value.toFixed(2)}%` : formatCurrency(value, language)}
      </span>
    </div>
  );
}

