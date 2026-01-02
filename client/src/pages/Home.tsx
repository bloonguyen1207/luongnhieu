import { Button } from "@/components/ui/button";
import { SalaryCalculator } from "@/components/SalaryCalculator";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { Moon, Sun, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Home Page
 * Design Philosophy: Steampunk-Neo Minimalist
 * - Header with navigation and theme/language toggles
 * - Main calculator in the center
 * - Footer with disclaimer
 * - Responsive layout with asymmetric spacing
 */

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
                <span className="font-mono font-bold text-accent-foreground text-lg">₫</span>
              </div>
              <div>
                <h1 className="text-xl font-mono font-bold leading-tight">
                  {t("appTitle", language)}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("appSubtitle", language)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger className="w-20 h-10 px-2">
                  <Globe className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                </SelectContent>
              </Select>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10"
                title={t("toggleTheme", language)}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Hero Section */}
        <div className="mb-12 pb-8 border-b border-border">
          <h2 className="text-3xl md:text-4xl font-mono font-bold mb-3 tracking-tight">
            {t("appTitle", language)}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t("appDescription", language)}
          </p>
        </div>

        {/* Calculator */}
        <SalaryCalculator />

        {/* Minimum Wage Info */}
        <section className="mt-12 pt-8 border-t border-border">
          <h3 className="text-lg font-mono font-bold mb-6">
            {t("minimumWageInfo", language)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MinimumWageCard region="I" language={language} />
            <MinimumWageCard region="II" language={language} />
            <MinimumWageCard region="III" language={language} />
            <MinimumWageCard region="IV" language={language} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h4 className="font-mono font-bold mb-3">{t("appTitle", language)}</h4>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "A precision salary calculator for Vietnam, built with transparency and accuracy."
                  : "Máy tính lương chính xác cho Việt Nam, xây dựng với tính minh bạch và độ chính xác."}
              </p>
            </div>

            {/* Tax Info */}
            <div>
              <h4 className="font-mono font-bold mb-3">
                {language === "en" ? "Tax Laws" : "Luật Thuế"}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  {language === "en"
                    ? "✓ 2025 Law (7-bracket PIT)"
                    : "✓ Luật 2025 (TNCN 7 bậc)"}
                </li>
                <li>
                  {language === "en"
                    ? "✓ 2026 Law (5-bracket PIT)"
                    : "✓ Luật 2026 (TNCN 5 bậc)"}
                </li>
                <li>
                  {language === "en"
                    ? "✓ Region-based calculations"
                    : "✓ Tính toán theo vùng"}
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-mono font-bold mb-3">
                {language === "en" ? "Information" : "Thông Tin"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Built with precision for clarity"
                  : "Xây dựng với độ chính xác cho sự rõ ràng"}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground text-center">
              {t("disclaimer", language)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface MinimumWageCardProps {
  region: "I" | "II" | "III" | "IV";
  language: "en" | "vi";
}

function MinimumWageCard({ region, language }: MinimumWageCardProps) {
  const minimumWages = {
    2025: { I: 4_960_000, II: 4_410_000, III: 3_860_000, IV: 3_450_000 },
    2026: { I: 5_310_000, II: 4_730_000, III: 4_140_000, IV: 3_700_000 },
  };

  const wage2025 = minimumWages[2025][region];
  const wage2026 = minimumWages[2026][region];
  const increase = wage2026 - wage2025;
  const increasePercent = ((increase / wage2025) * 100).toFixed(1);

  const regionLabels = {
    I: language === "en" ? "Region I" : "Vùng I",
    II: language === "en" ? "Region II" : "Vùng II",
    III: language === "en" ? "Region III" : "Vùng III",
    IV: language === "en" ? "Region IV" : "Vùng IV",
  };

  return (
    <div className="p-4 border border-border rounded-sm hover:border-accent transition-colors">
      <h4 className="font-mono font-bold text-sm mb-3">{regionLabels[region]}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">2025</span>
          <span className="font-mono font-medium">
            {(wage2025 / 1_000_000).toFixed(2)}M
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">2026</span>
          <span className="font-mono font-medium text-accent">
            {(wage2026 / 1_000_000).toFixed(2)}M
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground text-xs">{t("increase", language)}</span>
          <span className="font-mono font-bold text-xs text-green-600 dark:text-green-400">
            +{(increase / 1_000_000).toFixed(2)}M ({increasePercent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
