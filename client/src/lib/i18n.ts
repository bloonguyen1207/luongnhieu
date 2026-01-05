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
    grossSalary: 'Gross Salary (Lương Trước Thuế)',
    netSalary: 'Net Salary (Lương Ròng)',
    grossSalaryPlaceholder: 'Enter monthly salary',
    region: 'Region',
    regionI: 'Region I (Hanoi, HCMC, Hai Phong)',
    regionII: 'Region II',
    regionIII: 'Region III',
    regionIV: 'Region IV',
    dependents: 'Number of Dependents',
    dependentsHint: 'Spouse, children, or parents you support',
    taxLawYear: 'Tax Law Year',

    // Results Section
    results: 'Salary Breakdown',
    salaryBreakdown: 'Salary Breakdown',
    incomeBeforeTax: 'Income Before Tax',
    incomeBeforeTaxLabel: 'Income Before Tax',
    socialInsuranceLabel: 'Social Insurance (8%)',
    healthInsuranceLabel: 'Health Insurance (1.5%)',
    unemploymentInsuranceLabel: 'Unemployment Insurance (1%)',
    totalInsuranceLabel: 'Total Insurance Deduction',
    personalDeductionLabel: 'Personal Deduction',
    dependentDeductionLabel: 'Dependent Deduction',
    totalDeductionsLabel: 'Total Deductions',
    taxableIncomeLabel: 'Taxable Income',
    personalIncomeTaxLabel: 'Personal Income Tax (PIT)',
    netSalaryTakeHome: 'Net Salary (Take-Home)',
    monthlyTakeHome: 'Monthly take-home salary',

    // Employer Section
    employerCost: 'Employer Cost Breakdown',
    employerCostBreakdown: 'Employer Cost Breakdown',
    employerSocialInsuranceLabel: 'Social Insurance (Employer 14.5%)',
    employerHealthInsuranceLabel: 'Health Insurance (Employer 3%)',
    employerUnemploymentInsuranceLabel: 'Unemployment Insurance (Employer 1%)',
    totalEmployerContributionLabel: 'Total Employer Contribution',
    totalEmployerCostLabel: 'Total Employer Cost',
    employerNote: 'This is what the employer pays in addition to your gross salary',

    // Comparison Section
    comparisonTitle: 'Tax Law Comparison',
    taxLawComparison: 'Tax Law Comparison',
    oldLaw: 'Old Law (2025)',
    newLaw: 'New Law (2026)',
    oldLawPIT: 'Old Law (2025) PIT',
    newLawPIT: 'New Law (2026) PIT',
    taxSavingsLabel: 'Tax Savings',
    netSalaryComparisonLabel: 'Net Salary Comparison',
    percentageIncreaseLabel: 'Percentage Increase',
    youSave: 'You save',
    perMonth: 'per month',
    oldLawNetSalaryLabel: 'Old Law (2025) Net Salary',

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
    footer: '© 2026 LuongNhieu. All rights reserved. For informational purposes only.',

    // Minimum Wage Info
    minimumWageInfo: 'Minimum Wage Information',
    minimumWage: 'Minimum Wage',
    year2025: '2025 (7-bracket)',
    year2026: '2026 (5-bracket)',
    month: 'Month',
    increase: 'Increase',

    // Additional
    legalBasis: 'Legal Basis',
    sources: 'Sources',
    law2025: 'Law 2025 (TNCN 7 brackets)',
    law2026: 'Law 2026 (TNCN 5 brackets)',
    calculateByRegion: 'Calculate by region',
    comparisonNote: 'Comparison shows the difference between 2025 (7-bracket) and 2026 (5-bracket) tax laws',
    about: 'About LuongNhieu',
    aboutDescription: 'LuongNhieu helps Vietnamese workers calculate their net salary based on the latest labor law',
    taxLaws: 'Tax Laws',
    taxLawsDescription: 'Supports both 2025 (7-bracket) and 2026 (5-bracket) tax systems',
    insurance: 'Insurance',
    insuranceDescription: 'Calculates social, health, and unemployment insurance contributions',
    bilingual: 'Bilingual',
    bilingualDescription: 'Available in English and Vietnamese',
    darkModeFeature: 'Dark Mode',
    darkModeDescription: 'Comfortable viewing in any lighting condition',
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
    grossSalary: 'Lương Trước Thuế',
    netSalary: 'Lương Ròng',
    grossSalaryPlaceholder: 'Nhập lương hàng tháng',
    region: 'Vùng',
    regionI: 'Vùng I (Hà Nội, TP HCM, Hải Phòng)',
    regionII: 'Vùng II',
    regionIII: 'Vùng III',
    regionIV: 'Vùng IV',
    dependents: 'Số Người Phụ Thuộc',
    dependentsHint: 'Vợ/chồng, con cái, hoặc bố mẹ bạn nuôi',
    taxLawYear: 'Năm Áp Dụng Luật Thuế',

    // Results Section
    results: 'Chi Tiết Lương',
    salaryBreakdown: 'Chi Tiết Lương',
    incomeBeforeTax: 'Thu Nhập Trước Thuế',
    incomeBeforeTaxLabel: 'Thu Nhập Trước Thuế',
    socialInsuranceLabel: 'Bảo Hiểm Xã Hội (8%)',
    healthInsuranceLabel: 'Bảo Hiểm Y Tế (1.5%)',
    unemploymentInsuranceLabel: 'Bảo Hiểm Thất Nghiệp (1%)',
    totalInsuranceLabel: 'Tổng Đóng Bảo Hiểm',
    personalDeductionLabel: 'Giảm Trừ Cá Nhân',
    dependentDeductionLabel: 'Giảm Trừ Người Phụ Thuộc',
    totalDeductionsLabel: 'Tổng Giảm Trừ',
    taxableIncomeLabel: 'Thu Nhập Chịu Thuế',
    personalIncomeTaxLabel: 'Thuế Thu Nhập Cá Nhân (TNCN)',
    netSalaryTakeHome: 'Lương Ròng (Thực Nhận)',
    monthlyTakeHome: 'Lương thực nhận hàng tháng',

    // Employer Section
    employerCost: 'Chi Tiết Chi Phí Của Nhà Tuyển Dụng',
    employerCostBreakdown: 'Chi Tiết Chi Phí Của Nhà Tuyển Dụng',
    employerSocialInsuranceLabel: 'Bảo Hiểm Xã Hội Của NTD (14.5%)',
    employerHealthInsuranceLabel: 'Bảo Hiểm Y Tế Của NTD (3%)',
    employerUnemploymentInsuranceLabel: 'Bảo Hiểm Thất Nghiệp Của NTD (1%)',
    totalEmployerContributionLabel: 'Tổng Đóng Góp Của NTD',
    totalEmployerCostLabel: 'Tổng Chi Phí Của NTD',
    employerNote: 'Đây là những khoản mà nhà tuyển dụng phải trả thêm ngoài lương brutto của bạn',

    // Comparison Section
    comparisonTitle: 'So Sánh Luật Thuế',
    taxLawComparison: 'So Sánh Luật Thuế',
    oldLaw: 'Luật Cũ (2025)',
    newLaw: 'Luật Mới (2026)',
    oldLawPIT: 'Thuế Luật Cũ (2025)',
    newLawPIT: 'Thuế Luật Mới (2026)',
    taxSavingsLabel: 'Tiết Kiệm Thuế',
    netSalaryComparisonLabel: 'So Sánh Lương Ròng',
    percentageIncreaseLabel: 'Tăng Phần Trăm',
    youSave: 'Bạn tiết kiệm',
    perMonth: 'mỗi tháng',
    oldLawNetSalaryLabel: 'Lương Ròng Luật Cũ (2025)',

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
    footer: '© 2026 LuongNhieu. Tất cả quyền được bảo lưu. Chỉ dùng cho mục đích thông tin.',

    // Minimum Wage Info
    minimumWageInfo: 'Thông Tin Lương Tối Thiểu',
    minimumWage: 'Lương Tối Thiểu',
    year2025: '2025 (7 bậc)',
    year2026: '2026 (5 bậc)',
    month: 'Tháng',
    increase: 'Tăng',

    // Additional
    legalBasis: 'Cơ Sở Pháp Lý',
    sources: 'Nguồn Tham Khảo',
    law2025: 'Luật 2025 (TNCN 7 bậc)',
    law2026: 'Luật 2026 (TNCN 5 bậc)',
    calculateByRegion: 'Tính theo vùng',
    comparisonNote: 'So sánh hiển thị sự khác biệt giữa luật thuế 2025 (7 bậc) và 2026 (5 bậc)',
    about: 'Về LuongNhieu',
    aboutDescription: 'LuongNhieu giúp người lao động Việt Nam tính toán lương ròng dựa trên luật lao động mới nhất',
    taxLaws: 'Luật Thuế',
    taxLawsDescription: 'Hỗ trợ cả hệ thống thuế 2025 (7 bậc) và 2026 (5 bậc)',
    insurance: 'Bảo Hiểm',
    insuranceDescription: 'Tính toán đóng góp bảo hiểm xã hội, y tế và thất nghiệp',
    bilingual: 'Hai Ngôn Ngữ',
    bilingualDescription: 'Có sẵn bằng tiếng Anh và tiếng Việt',
    darkModeFeature: 'Chế Độ Tối',
    darkModeDescription: 'Xem thoải mái trong bất kỳ điều kiện ánh sáng nào',
  },
};

export function t(key: string, language: Language = 'en'): string {
  return (translations[language] as any)[key] || (translations.en as any)[key] || key;
}
