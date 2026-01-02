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
  const [grossSalary, setGrossSalary] = useState<number>(10_000_000);
  const [region, setRegion] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [dependents, setDependents] = useState<number>(0);
  const [year, setYear] = useState<2025 | 2026>(2026);

  const result = useMemo<SalaryBreakdown>(() => {
    return calculateSalary({
      grossSalary,
      region,
      dependents,
      year,
    });
  }, [grossSalary, region, dependents, year]);

  const handleReset = () => {
    setGrossSalary(10_000_000);
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
          {/* Gross Salary */}
          <div className="space-y-2">
            <Label htmlFor="grossSalary" className="text-sm font-medium">
              {t('grossSalary', language)}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ₫
              </span>
              <Input
                id="grossSalary"
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Number(e.target.value))}
                placeholder={t('grossSalaryPlaceholder', language)}
                className="pl-6 font-mono text-base"
                min="0"
                step="100000"
              />
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
              Tax Law Year
            </Label>
            <Select value={year.toString()} onValueChange={(value) => setYear(Number(value) as 2025 | 2026)}>
              <SelectTrigger id="year" className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025 (7-bracket)</SelectItem>
                <SelectItem value="2026">2026 (5-bracket)</SelectItem>
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
            {t('netSalary', language)}
          </p>
          <p className="text-4xl font-mono font-bold text-accent">
            {formatCurrency(result.netSalary, language)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {language === 'vi' ? 'Lương thực nhận hàng tháng' : 'Monthly take-home salary'}
          </p>
        </div>
      </Card>

      {/* Breakdown Section */}
      <Card className="p-6 border-l-4 border-l-primary">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
        >
          <h3 className="text-lg font-mono font-bold">{t('results', language)}</h3>
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
              label={t('socialInsurance', language)}
              value={-result.socialInsurance}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('healthInsurance', language)}
              value={-result.healthInsurance}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('unemploymentInsurance', language)}
              value={-result.unemploymentInsurance}
              language={language}
              isDeduction
            />
            <ResultRow
              label={t('totalInsurance', language)}
              value={-result.totalInsurance}
              language={language}
              isDeduction
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('incomeBeforeTax', language)}
              value={result.incomeBeforeTax}
              language={language}
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('personalDeduction', language)}
              value={-result.personalDeduction}
              language={language}
              isDeduction
              isSmall
            />
            <ResultRow
              label={t('dependentDeduction', language)}
              value={-result.dependentDeduction}
              language={language}
              isDeduction
              isSmall
            />
            <ResultRow
              label={t('taxableIncome', language)}
              value={result.taxableIncome}
              language={language}
              isBold
            />

            <div className="my-2 border-t border-border" />

            <ResultRow
              label={t('personalIncomeTax', language)}
              value={-result.pit}
              language={language}
              isDeduction
              isBold
            />

            <div className="my-3 border-t-2 border-accent" />

            <ResultRow
              label={t('netSalary', language)}
              value={result.netSalary}
              language={language}
              isBold
              isHighlight
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
          <h3 className="text-lg font-mono font-bold">{t('employerCost', language)}</h3>
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
              label={t('employerSocialInsurance', language)}
              value={result.employerSocialInsurance}
              language={language}
            />
            <ResultRow
              label={t('employerHealthInsurance', language)}
              value={result.employerHealthInsurance}
              language={language}
            />
            <ResultRow
              label={t('employerUnemploymentInsurance', language)}
              value={result.employerUnemploymentInsurance}
              language={language}
            />

            <div className="my-3 border-t-2 border-accent" />

            <ResultRow
              label={t('totalEmployerCost', language)}
              value={result.totalEmployerCost}
              language={language}
              isBold
              isHighlight
            />

            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
              {t('employerNote', language)}
            </p>
          </div>
        )}
      </Card>

      {/* Comparison Section */}
      {result.oldLawPIT !== undefined && (
        <Card className="p-6 border-l-4 border-l-accent">
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          >
            <h3 className="text-lg font-mono font-bold">{t('comparisonTitle', language)}</h3>
            <span className="text-2xl text-muted-foreground">
              {expandedSections.has('comparison') ? '−' : '+'}
            </span>
          </button>

          {expandedSections.has('comparison') && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/50 rounded border border-border">
                  <p className="text-xs text-muted-foreground mb-2">{t('oldLaw', language)}</p>
                  <p className="text-2xl font-mono font-bold">
                    {formatCurrency(result.oldLawPIT || 0, language)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t('oldLawPIT', language)}</p>
                </div>

                <div className="p-4 bg-accent/10 rounded border border-accent">
                  <p className="text-xs text-muted-foreground mb-2">{t('newLaw', language)}</p>
                  <p className="text-2xl font-mono font-bold text-accent">
                    {formatCurrency(result.pit, language)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t('newLawPIT', language)}</p>
                </div>
              </div>

              {result.taxSavings !== undefined && result.taxSavings > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    {t('youSave', language)} {formatCurrency(result.taxSavings, language)} {t('perMonth', language)}
                  </p>
                </div>
              )}

              {result.netPercentageChange !== undefined && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {t('netSalaryComparison', language)}: +{result.netPercentageChange.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Tax Breakdown Section */}
      {result.pitBreakdown.length > 0 && (
        <Card className="p-6 border-l-4 border-l-primary">
          <button
            onClick={() => toggleSection('taxBreakdown')}
            className="w-full flex justify-between items-center mb-4 hover:opacity-75 transition-opacity"
          >
            <h3 className="text-lg font-mono font-bold">{t('taxBreakdown', language)}</h3>
            <span className="text-2xl text-muted-foreground">
              {expandedSections.has('taxBreakdown') ? '−' : '+'}
            </span>
          </button>

          {expandedSections.has('taxBreakdown') && (
            <div className="overflow-x-auto pt-4 border-t border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-mono font-bold text-xs text-muted-foreground">
                      {t('bracket', language)}
                    </th>
                    <th className="text-right py-2 px-2 font-mono font-bold text-xs text-muted-foreground">
                      {t('incomeRange', language)}
                    </th>
                    <th className="text-right py-2 px-2 font-mono font-bold text-xs text-muted-foreground">
                      {t('rate', language)}
                    </th>
                    <th className="text-right py-2 px-2 font-mono font-bold text-xs text-muted-foreground">
                      {t('taxAmount', language)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.pitBreakdown.map((row, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-2 px-2 font-mono">{row.bracket}</td>
                      <td className="text-right py-2 px-2 font-mono text-xs">
                        {formatCurrency(row.income, language)}
                      </td>
                      <td className="text-right py-2 px-2 font-mono font-medium">{row.rate.toFixed(0)}%</td>
                      <td className="text-right py-2 px-2 font-mono font-bold">
                        {formatCurrency(row.tax, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  isHighlight?: boolean;
  isSmall?: boolean;
}

function ResultRow({
  label,
  value,
  language,
  isDeduction,
  isBold,
  isHighlight,
  isSmall,
}: ResultRowProps) {
  return (
    <div className={`flex justify-between items-center ${isSmall ? 'text-sm' : ''}`}>
      <span className={`${isBold ? 'font-bold' : ''} ${isHighlight ? 'text-accent' : ''}`}>
        {label}
      </span>
      <span
        className={`font-mono ${isBold ? 'font-bold' : 'font-medium'} ${
          isHighlight ? 'text-accent text-lg' : ''
        } ${isDeduction ? 'text-destructive' : ''}`}
      >
        {isDeduction ? '− ' : ''}
        {formatCurrency(Math.abs(value), language)}
      </span>
    </div>
  );
}
