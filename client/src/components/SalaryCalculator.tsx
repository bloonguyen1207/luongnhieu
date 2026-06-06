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

export function SalaryCalculator() {
  const { language } = useLanguage();
  const [salary, setSalary] = useState<number>(10_000_000);
  const [salaryDisplay, setSalaryDisplay] = useState<string>(formatNumberInput(10_000_000));
  const [salaryType, setSalaryType] = useState<'gross' | 'net'>('gross');
  const [region, setRegion] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [dependents, setDependents] = useState<number>(0);
  const [year, setYear] = useState<2025 | 2026>(2026);
  const [workerType, setWorkerType] = useState<WorkerType>('employee');
  const [payerType, setPayerType] = useState<PayerType>('domestic');

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
    return calculateFreelancerContract(salary, dependents, year, salaryType, payerType);
  }, [salary, salaryType, dependents, year, payerType]);

  const freelancerBusinessResult = useMemo<FreelancerBusinessBreakdown>(() => {
    return calculateFreelancerBusiness(salary, year);
  }, [salary, year]);

  const handleReset = () => {
    setSalary(10_000_000);
    setSalaryDisplay(formatNumberInput(10_000_000));
    setSalaryType('gross');
    setRegion('I');
    setDependents(0);
    setYear(2026);
    setWorkerType('employee');
    setPayerType('domestic');
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const parsed = parseNumberInput(input);
    setSalary(isNaN(parsed) ? 0 : parsed);
    setSalaryDisplay(input);
  };

  const handleSalaryBlur = () => {
    setSalaryDisplay(formatNumberInput(salary));
  };

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
          <Label className="text-sm font-medium block mb-2">{t('workerType', language)}</Label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { v: 'employee', k: 'workerTypeEmployee' },
                { v: 'freelancerContract', k: 'workerTypeFreelancerContract' },
                { v: 'freelancerBusiness', k: 'workerTypeFreelancerBusiness' },
              ] as Array<{ v: WorkerType; k: string }>
            ).map(({ v, k }) => (
              <button
                key={v}
                onClick={() => setWorkerType(v)}
                className={`text-xs px-3 py-2 rounded transition-colors ${
                  workerType === v
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {t(k, language)}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t('workerTypeHint', language)}</p>
        </div>

        {/* Payer Type Toggle (only for Service Contract) */}
        {workerType === 'freelancerContract' && (
          <div className="mb-6">
            <Label className="text-sm font-medium block mb-2">{t('payerType', language)}</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { v: 'domestic', k: 'payerTypeDomestic' },
                  { v: 'foreign', k: 'payerTypeForeign' },
                ] as Array<{ v: PayerType; k: string }>
              ).map(({ v, k }) => (
                <button
                  key={v}
                  onClick={() => setPayerType(v)}
                  className={`text-xs px-3 py-2 rounded transition-colors ${
                    payerType === v
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {t(k, language)}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t('payerTypeHint', language)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Input */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">
              {salaryLabel}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ₫
              </span>
              <Input
                id="salary"
                type="text"
                inputMode="numeric"
                value={salaryDisplay}
                onChange={handleSalaryChange}
                onBlur={handleSalaryBlur}
                placeholder={t('grossSalaryPlaceholder', language)}
                className="pl-6 font-mono text-base"
              />
            </div>
            {showNetGrossToggle && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSalaryType('gross')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${salaryType === 'gross'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                  {language === 'en' ? 'Gross' : 'Trước thuế'}
                </button>
                <button
                  onClick={() => setSalaryType('net')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${salaryType === 'net'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                  {language === 'en' ? 'Net' : 'Ròng'}
                </button>
              </div>
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
                type="number"
                value={dependents}
                onChange={(e) => setDependents(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="font-mono text-base"
                min="0"
                max="10"
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

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 font-mono"
          >
            {t('reset', language)}
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
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {t('netSalaryTakeHome', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.netSalary, language)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {t('monthlyTakeHome', language)}
          </p>
        </div>
      </Card>

      {/* Breakdown Section */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('salaryBreakdown', language)}</h3>
          <span className="text-2xl text-muted-foreground">
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

      {/* Employer Cost Section */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('employer')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('employerCostBreakdown', language)}</h3>
          <span className="text-2xl text-muted-foreground">
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
          >
            <h3 className="text-lg font-mono font-bold">{t('taxLawComparison', language)}</h3>
            <span className="text-2xl text-muted-foreground">
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

      {/* Minimum Wage Info */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('minimumWage')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('minimumWageInfo', language)}</h3>
          <span className="text-2xl text-muted-foreground">
            {expandedSections.has('minimumWage') ? '−' : '+'}
          </span>
        </button>

        {expandedSections.has('minimumWage') && (
          <div className="space-y-4 pt-4 border-t border-border">
            <MinimumWageTable language={language} year={(result as any).year || 2026} />
          </div>
        )}
      </Card>
    </div>
  );
}

interface FreelancerContractResultsProps {
  result: FreelancerContractBreakdown;
  language: 'en' | 'vi';
}

function FreelancerContractResults({ result, language }: FreelancerContractResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['monthly', 'annual']));
  const toggleSection = (s: string) => {
    const next = new Set(expandedSections);
    if (next.has(s)) next.delete(s); else next.add(s);
    setExpandedSections(next);
  };

  const isForeign = result.payerType === 'foreign';
  const refundPositive = result.finalizationDelta >= 0;

  return (
    <div className="space-y-4">
      <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {t('monthlyNetTakeHome', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.monthlyNet, language)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isForeign ? t('foreignPayerNote', language) : t('withholdingNote', language)}
          </p>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('monthly')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('freelancerContractTitle', language)}</h3>
          <span className="text-2xl text-muted-foreground">
            {expandedSections.has('monthly') ? '−' : '+'}
          </span>
        </button>

        {expandedSections.has('monthly') && (
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {isForeign
                ? t('freelancerContractDescriptionForeign', language)
                : t('freelancerContractDescription', language)}
            </p>
            <ResultRow
              label={t('monthlyPayment', language)}
              value={result.monthlyGross}
              language={language}
            />
            {!isForeign && (
              <ResultRow
                label={t('monthlyWithholding', language)}
                value={-result.monthlyWithholding}
                language={language}
                isDeduction
              />
            )}
            <div className="my-2 border-t border-border" />
            <ResultRow
              label={t('monthlyNetTakeHome', language)}
              value={result.monthlyNet}
              language={language}
              isBold
            />
            {isForeign && (
              <p className="text-xs text-muted-foreground mt-2">
                {t('selfDeclareWarning', language)}
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('annual')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('annualFinalization', language)}</h3>
          <span className="text-2xl text-muted-foreground">
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
              label={t('annualNet', language)}
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
    </div>
  );
}

interface FreelancerBusinessResultsProps {
  result: FreelancerBusinessBreakdown;
  language: 'en' | 'vi';
}

function FreelancerBusinessResults({ result, language }: FreelancerBusinessResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['breakdown']));
  const toggleSection = (s: string) => {
    const next = new Set(expandedSections);
    if (next.has(s)) next.delete(s); else next.add(s);
    setExpandedSections(next);
  };

  return (
    <div className="space-y-4">
      <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {t('monthlyNetTakeHome', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.monthlyNet, language)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {result.isExempt ? t('exemptStatus', language) : t('notExemptStatus', language)}
          </p>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('freelancerBusinessTitle', language)}</h3>
          <span className="text-2xl text-muted-foreground">
            {expandedSections.has('breakdown') ? '−' : '+'}
          </span>
        </button>

        {expandedSections.has('breakdown') && (
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {t('freelancerBusinessDescription', language)}
            </p>

            <ResultRow
              label={t('monthlyRevenue', language)}
              value={result.monthlyRevenue}
              language={language}
            />
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
              label={t('vatLabel', language)}
              value={-result.monthlyVAT}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('businessPITLabel', language)}
              value={-result.monthlyPIT}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('totalTaxLabel', language)}
              value={-result.monthlyTotalTax}
              language={language}
              isDeduction
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('annualVATLabel', language)}
              value={-result.annualVAT}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('annualPITLabel', language)}
              value={-result.annualPIT}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('annualTotalTax', language)}
              value={-result.annualTotalTax}
              language={language}
              isDeduction
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('monthlyNetTakeHome', language)}
              value={result.monthlyNet}
              language={language}
              isBold
            />
            <ResultRow
              label={t('annualNet', language)}
              value={result.annualNet}
              language={language}
              isBold
            />

            <p className="text-xs text-muted-foreground mt-2">
              {t('freelancerBusinessFooter', language)}
            </p>
          </div>
        )}
      </Card>
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

interface MinimumWageTableProps {
  language: 'en' | 'vi';
  year?: 2025 | 2026;
}

function MinimumWageTable({ language, year = 2026 }: MinimumWageTableProps) {
  const minimumWages: Record<string, Record<number, number>> = {
    I: { 2025: 5_300_000, 2026: 5_680_000 },
    II: { 2025: 4_640_000, 2026: 4_970_000 },
    III: { 2025: 4_110_000, 2026: 4_410_000 },
    IV: { 2025: 3_680_000, 2026: 3_945_000 },
  };

  return (
    <div className="space-y-4">
      {Object.entries(minimumWages).map(([region, wages]) => (
        <div key={region} className="space-y-2">
          <h4 className="font-mono font-semibold text-sm">
            {language === 'en' ? `Region ${region}` : `Vùng ${region}`}
          </h4>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">{t('year2025', language)}</p>
              <p className="font-mono font-semibold">{formatCurrency(wages[2025] ?? 0, language)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('year2026', language)}</p>
              <p className="font-mono font-semibold">{formatCurrency(wages[2026] ?? 0, language)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('increase', language)}</p>
              <p className="font-mono font-semibold text-accent">
                +{formatCurrency((wages[2026] ?? 0) - (wages[2025] ?? 0), language)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
