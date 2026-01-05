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
import { calculateSalary, formatCurrency, SalaryBreakdown } from '@/lib/salaryCalculator';
import { t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SalaryCalculator Component
 * Design Philosophy: Steampunk-Neo Minimalist
 * - Input section with clean grid layout
 * - Real-time calculation with smooth transitions
 * - Precision typography for numbers (monospace)
 */

export function SalaryCalculator() {
  const { language } = useLanguage();
  const [salary, setSalary] = useState<number>(10_000_000);
  const [salaryType, setSalaryType] = useState<'gross' | 'net'>('gross');
  const [region, setRegion] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [dependents, setDependents] = useState<number>(0);
  const [year, setYear] = useState<2025 | 2026>(2026);

  const result = useMemo<SalaryBreakdown>(() => {
    return calculateSalary({
      salary,
      salaryType,
      region,
      dependents,
      year,
    });
  }, [salary, salaryType, region, dependents, year]);

  const handleReset = () => {
    setSalary(10_000_000);
    setSalaryType('gross');
    setRegion('I');
    setDependents(0);
    setYear(2026);
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="p-6 border-l-4 border-l-accent">
        <h2 className="text-2xl font-mono font-bold mb-6 text-foreground">
          {t('calculator', language)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Input */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">
              {salaryType === 'gross' ? t('grossSalary', language) : t('netSalary', language)}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ₫
              </span>
              <Input
                id="salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                placeholder={t('grossSalaryPlaceholder', language)}
                className="pl-6 font-mono text-base"
                min="0"
                step="100000"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSalaryType('gross')}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  salaryType === 'gross'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {language === 'en' ? 'Gross' : 'Brutto'}
              </button>
              <button
                onClick={() => setSalaryType('net')}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  salaryType === 'net'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {language === 'en' ? 'Net' : 'Ròng'}
              </button>
            </div>
          </div>

          {/* Region */}
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

          {/* Dependents */}
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
      <SalaryResults result={result} language={language} />
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
