/**
 * Internationalization (i18n) - English & Vietnamese
 * Design Philosophy: Steampunk-Neo Minimalist
 * - Precision: Technical terms translated accurately
 * - Clarity: Bilingual support for Vietnamese and international users
 */

export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Header
    appTitle: 'LuongNhieu',
    appSubtitle: 'Vietnam Salary Calculator',
    appDescription: 'Calculate your net salary, taxes, and insurance contributions based on Vietnam labor law',

    // Navigation
    calculator: 'Calculator',
    comparison: 'Comparison',
    breakdown: 'Breakdown',
    settings: 'Settings',

    // Input Labels
    grossSalary: 'Gross Salary',
    grossSalaryPlaceholder: 'Enter monthly gross salary',
    region: 'Region',
    regionI: 'Region I (Hanoi, HCMC, Hai Phong)',
    regionII: 'Region II',
    regionIII: 'Region III',
    regionIV: 'Region IV',
    dependents: 'Number of Dependents',
    dependentsHint: 'Spouse, children, or parents you support',

    // Results Section
    results: 'Salary Breakdown',
    incomeBeforeTax: 'Income Before Tax',
    socialInsurance: 'Social Insurance (8%)',
    healthInsurance: 'Health Insurance (1.5%)',
    unemploymentInsurance: 'Unemployment Insurance (1%)',
    totalInsurance: 'Total Insurance Deduction',
    personalDeduction: 'Personal Deduction',
    dependentDeduction: 'Dependent Deduction',
    totalDeductions: 'Total Deductions',
    taxableIncome: 'Taxable Income',
    personalIncomeTax: 'Personal Income Tax (PIT)',
    netSalary: 'Net Salary (Take-Home)',

    // Employer Section
    employerCost: 'Employer Cost Breakdown',
    employerSocialInsurance: 'Employer Social Insurance (14.5%)',
    employerHealthInsurance: 'Employer Health Insurance (3%)',
    employerUnemploymentInsurance: 'Employer Unemployment Insurance (1%)',
    totalEmployerContribution: 'Total Employer Contribution',
    totalEmployerCost: 'Total Employer Cost',
    employerNote: 'This is what the employer pays in addition to your gross salary',

    // Comparison Section
    comparisonTitle: 'Tax Law Comparison',
    oldLaw: 'Old Law (2025)',
    newLaw: 'New Law (2026)',
    oldLawPIT: 'PIT (7-bracket)',
    newLawPIT: 'PIT (5-bracket)',
    taxSavings: 'Tax Savings',
    netSalaryComparison: 'Net Salary Comparison',
    percentageIncrease: 'Percentage Increase',
    youSave: 'You save',
    perMonth: 'per month',

    // Tax Breakdown
    taxBreakdown: 'Tax Calculation Breakdown',
    bracket: 'Bracket',
    incomeRange: 'Income Range',
    rate: 'Rate',
    taxAmount: 'Tax Amount',

    // Buttons
    calculate: 'Calculate',
    reset: 'Reset',
    copy: 'Copy',
    copied: 'Copied!',
    export: 'Export',
    toggleTheme: 'Toggle Dark Mode',
    changeLanguage: 'Change Language',

    // Messages
    enterValidSalary: 'Please enter a valid salary amount',
    selectRegion: 'Please select a region',
    calculationComplete: 'Calculation complete',
    noData: 'No data to display',

    // Footer
    disclaimer: 'This calculator is based on Vietnam labor law as of 2025-2026. For official tax information, consult the Vietnamese Tax Authority.',
    builtWith: 'Built with precision for clarity',

    // Minimum Wage Info
    minimumWageInfo: 'Minimum Wage Information',
    minimumWage: 'Minimum Wage',
    region2025: '2025',
    region2026: '2026',
    increase: 'Increase',
  },

  vi: {
    // Header
    appTitle: 'LuongNhieu',
    appSubtitle: 'Máy Tính Lương Việt Nam',
    appDescription: 'Tính toán lương ròng, thuế, và đóng góp bảo hiểm dựa trên luật lao động Việt Nam',

    // Navigation
    calculator: 'Máy Tính',
    comparison: 'So Sánh',
    breakdown: 'Chi Tiết',
    settings: 'Cài Đặt',

    // Input Labels
    grossSalary: 'Lương Brutto',
    grossSalaryPlaceholder: 'Nhập lương hàng tháng',
    region: 'Vùng',
    regionI: 'Vùng I (Hà Nội, TP HCM, Hải Phòng)',
    regionII: 'Vùng II',
    regionIII: 'Vùng III',
    regionIV: 'Vùng IV',
    dependents: 'Số Người Phụ Thuộc',
    dependentsHint: 'Vợ/chồng, con cái, hoặc bố mẹ bạn nuôi',

    // Results Section
    results: 'Chi Tiết Lương',
    incomeBeforeTax: 'Thu Nhập Trước Thuế',
    socialInsurance: 'Bảo Hiểm Xã Hội (8%)',
    healthInsurance: 'Bảo Hiểm Y Tế (1,5%)',
    unemploymentInsurance: 'Bảo Hiểm Thất Nghiệp (1%)',
    totalInsurance: 'Tổng Đóng Bảo Hiểm',
    personalDeduction: 'Giảm Trừ Cá Nhân',
    dependentDeduction: 'Giảm Trừ Người Phụ Thuộc',
    totalDeductions: 'Tổng Giảm Trừ',
    taxableIncome: 'Thu Nhập Chịu Thuế',
    personalIncomeTax: 'Thuế Thu Nhập Cá Nhân (TNCN)',
    netSalary: 'Lương Ròng (Thực Nhận)',

    // Employer Section
    employerCost: 'Chi Tiết Chi Phí Của Nhà Tuyển Dụng',
    employerSocialInsurance: 'Bảo Hiểm Xã Hội Của NTD (14,5%)',
    employerHealthInsurance: 'Bảo Hiểm Y Tế Của NTD (3%)',
    employerUnemploymentInsurance: 'Bảo Hiểm Thất Nghiệp Của NTD (1%)',
    totalEmployerContribution: 'Tổng Đóng Góp Của NTD',
    totalEmployerCost: 'Tổng Chi Phí Của NTD',
    employerNote: 'Đây là những khoản mà nhà tuyển dụng phải trả thêm ngoài lương brutto của bạn',

    // Comparison Section
    comparisonTitle: 'So Sánh Luật Thuế',
    oldLaw: 'Luật Cũ (2025)',
    newLaw: 'Luật Mới (2026)',
    oldLawPIT: 'TNCN (7 bậc)',
    newLawPIT: 'TNCN (5 bậc)',
    taxSavings: 'Tiết Kiệm Thuế',
    netSalaryComparison: 'So Sánh Lương Ròng',
    percentageIncrease: 'Tăng Phần Trăm',
    youSave: 'Bạn tiết kiệm',
    perMonth: 'mỗi tháng',

    // Tax Breakdown
    taxBreakdown: 'Chi Tiết Tính Thuế',
    bracket: 'Bậc',
    incomeRange: 'Khoảng Thu Nhập',
    rate: 'Suất Thuế',
    taxAmount: 'Tiền Thuế',

    // Buttons
    calculate: 'Tính Toán',
    reset: 'Đặt Lại',
    copy: 'Sao Chép',
    copied: 'Đã Sao Chép!',
    export: 'Xuất',
    toggleTheme: 'Chế Độ Tối',
    changeLanguage: 'Đổi Ngôn Ngữ',

    // Messages
    enterValidSalary: 'Vui lòng nhập lương hợp lệ',
    selectRegion: 'Vui lòng chọn vùng',
    calculationComplete: 'Tính toán hoàn tất',
    noData: 'Không có dữ liệu để hiển thị',

    // Footer
    disclaimer: 'Máy tính này dựa trên luật lao động Việt Nam từ 2025-2026. Để biết thông tin thuế chính thức, hãy liên hệ Cục Thuế Việt Nam.',
    builtWith: 'Xây dựng với độ chính xác cho sự rõ ràng',

    // Minimum Wage Info
    minimumWageInfo: 'Thông Tin Lương Tối Thiểu',
    minimumWage: 'Lương Tối Thiểu',
    region2025: '2025',
    region2026: '2026',
    increase: 'Tăng',
  },
};

export function t(key: keyof typeof translations.en, language: Language = 'en'): string {
  return translations[language][key] || translations.en[key] || key;
}
