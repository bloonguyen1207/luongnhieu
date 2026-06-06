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
    appTitle: 'Lương Nhiêu',
    appSubtitle: 'Vietnam Salary Calculator',
    appDescription: 'Calculate your net salary, taxes, and insurance contributions based on Vietnam labor law',

    // Navigation
    calculator: 'Calculator',
    comparison: 'Comparison',
    breakdown: 'Breakdown',
    settings: 'Settings',

    // Input Labels
    salary: 'Salary',
    grossSalary: 'Gross Salary (Lương Tổng)',
    netSalary: 'Net Salary (Lương Thực Nhận)',
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

    // Worker type
    workerType: 'Employment Type',
    workerTypeEmployee: 'Employee',
    workerTypeFreelancerContract: 'Freelancer (Service Contract)',
    workerTypeFreelancerBusiness: 'Freelancer (Household Business)',
    workerTypeHint: 'Choose how you receive income — affects which taxes and fees apply',

    // Freelancer (Service Contract)
    freelancerContractTitle: 'Freelancer Tax (Service Contract)',
    freelancerContractDescription: 'You sign a service contract with a company. No insurance, no employer contributions. Each payment ≥ 2M VND is subject to 10% PIT withholding (Circular 111/2013/TT-BTC).',
    monthlyPayment: 'Monthly Payment',
    monthlyWithholding: 'PIT Withheld (10%)',
    monthlyNetTakeHome: 'Monthly Take-Home',
    withholdingNote: 'Company withholds 10% PIT on each payment ≥ ₫2,000,000',
    annualFinalization: 'Annual Tax Finalization',
    annualGross: 'Annual Gross Income',
    annualPersonalDeduction: 'Annual Personal Deduction',
    annualDependentDeduction: 'Annual Dependent Deduction',
    annualTaxableIncome: 'Annual Taxable Income',
    annualFinalPIT: 'Final Annual PIT (Progressive)',
    annualWithholdingPaid: 'PIT Already Withheld (10% × 12)',
    finalizationRefund: 'Refund at Year-End',
    finalizationOwed: 'Additional PIT Owed at Year-End',
    annualNet: 'Annual Net (After Finalization)',
    monthlyNetEffective: 'Effective Monthly Net (After Finalization)',
    freelancerContractFooter: 'Annual finalization applies progressive PIT rates with personal + dependent deductions, then credits the 10% already withheld.',
    freelancerContractFooterForeign: 'Annual finalization applies progressive PIT rates with personal + dependent deductions. Since nothing was withheld, the full amount is owed at year-end.',
    freelancerContractDescriptionForeign: 'You sign a service contract with a foreign company that has no Vietnamese tax registration. No insurance, no withholding. You self-declare PIT monthly and finalize at year-end.',
    payerType: 'Payer',
    payerTypeDomestic: 'Vietnamese Company',
    payerTypeForeign: 'Foreign Company',
    payerTypeHint: 'Foreign payers (no Vietnamese tax registration) cannot withhold PIT — you self-declare and pay the full progressive PIT yourself.',
    foreignPayerNote: 'Foreign payer: no withholding. You must self-declare PIT (monthly by the 20th of the following month, plus annual finalization).',
    annualPITOwed: 'Total Annual PIT Owed',
    selfDeclareWarning: 'Since the foreign company does not withhold, you owe the full progressive PIT amount at finalization.',

    // Freelancer (Household Business)
    freelancerBusinessTitle: 'Freelancer Tax (Household Business)',
    freelancerBusinessDescription: 'You register as an individual business (hộ kinh doanh) providing services. From 2026: lump-sum tax abolished, self-declared. Services taxed at VAT 5% + PIT 2% on revenue (Circular 40/2021/TT-BTC).',
    monthlyRevenue: 'Monthly Revenue',
    annualRevenue: 'Annual Revenue',
    exemptThreshold: 'Tax-Exempt Threshold',
    exemptStatus: 'Exempt — revenue below threshold',
    notExemptStatus: 'Taxable — revenue exceeds threshold',
    vatLabel: 'VAT (5% of revenue)',
    businessPITLabel: 'PIT (2% of revenue)',
    totalTaxLabel: 'Total Tax (7% of revenue)',
    annualVATLabel: 'Annual VAT',
    annualPITLabel: 'Annual PIT',
    annualTotalTax: 'Annual Total Tax',
    freelancerBusinessFooter: 'Per Decree 141/2026/ND-CP, household businesses with annual revenue ≤ ₫1,000,000,000 are exempt from VAT and PIT.',
    perMonthSuffix: '/month',
    perYearSuffix: '/year',
  },

  vi: {
    // Header
    appTitle: 'Lương Nhiêu',
    appSubtitle: 'Tính Lương Việt Nam',
    appDescription: 'Tính toán lương ròng, thuế, và BHXH dựa trên luật lao động Việt Nam',

    // Navigation
    calculator: 'Máy Tính',
    comparison: 'So Sánh',
    breakdown: 'Chi Tiết',
    settings: 'Cài Đặt',

    // Input Labels
    salary: 'Lương',
    grossSalary: 'Lương Tổng',
    netSalary: 'Lương Thực Nhận',
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
    netSalaryTakeHome: 'Lương Thực Nhận',
    monthlyTakeHome: 'Lương thực nhận hàng tháng',

    // Employer Section
    employerCost: 'Chi Tiết Chi Phí Của Nhà Tuyển Dụng',
    employerCostBreakdown: 'Chi Tiết Chi Phí Của Nhà Tuyển Dụng',
    employerSocialInsuranceLabel: 'Bảo Hiểm Xã Hội Của NTD (14.5%)',
    employerHealthInsuranceLabel: 'Bảo Hiểm Y Tế Của NTD (3%)',
    employerUnemploymentInsuranceLabel: 'Bảo Hiểm Thất Nghiệp Của NTD (1%)',
    totalEmployerContributionLabel: 'Tổng Đóng Góp Của NTD',
    totalEmployerCostLabel: 'Tổng Chi Phí Của NTD',
    employerNote: 'Đây là những khoản mà nhà tuyển dụng phải trả thêm ngoài lương tổng của bạn',

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
    disclaimer: 'Website này dựa trên luật lao động Việt Nam từ 2025-2026. Để biết thông tin thuế chính thức, hãy liên hệ Cục Thuế Việt Nam.',
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

    // Worker type
    workerType: 'Hình Thức Làm Việc',
    workerTypeEmployee: 'Nhân Viên',
    workerTypeFreelancerContract: 'Freelancer (Hợp Đồng Dịch Vụ)',
    workerTypeFreelancerBusiness: 'Freelancer (Hộ Kinh Doanh)',
    workerTypeHint: 'Chọn cách bạn nhận thu nhập — ảnh hưởng đến các loại thuế và phí áp dụng',

    // Freelancer (Service Contract)
    freelancerContractTitle: 'Thuế Freelancer (Hợp Đồng Dịch Vụ)',
    freelancerContractDescription: 'Bạn ký hợp đồng dịch vụ với công ty. Không bảo hiểm, không đóng góp từ NTD. Mỗi lần chi trả ≥ 2 triệu VNĐ bị khấu trừ 10% TNCN tại nguồn (Thông tư 111/2013/TT-BTC).',
    monthlyPayment: 'Thu Nhập Hàng Tháng',
    monthlyWithholding: 'TNCN Khấu Trừ (10%)',
    monthlyNetTakeHome: 'Thực Nhận Hàng Tháng',
    withholdingNote: 'Công ty khấu trừ 10% TNCN trên mỗi lần chi trả ≥ ₫2,000,000',
    annualFinalization: 'Quyết Toán Thuế Cuối Năm',
    annualGross: 'Tổng Thu Nhập Cả Năm',
    annualPersonalDeduction: 'Giảm Trừ Cá Nhân Cả Năm',
    annualDependentDeduction: 'Giảm Trừ Người Phụ Thuộc Cả Năm',
    annualTaxableIncome: 'Thu Nhập Chịu Thuế Cả Năm',
    annualFinalPIT: 'TNCN Cuối Năm (Lũy Tiến)',
    annualWithholdingPaid: 'TNCN Đã Khấu Trừ (10% × 12)',
    finalizationRefund: 'Được Hoàn Thuế Cuối Năm',
    finalizationOwed: 'Phải Nộp Thêm Cuối Năm',
    annualNet: 'Thực Nhận Cả Năm (Sau Quyết Toán)',
    monthlyNetEffective: 'Thực Nhận Bình Quân/Tháng (Sau Quyết Toán)',
    freelancerContractFooter: 'Quyết toán cuối năm áp dụng biểu thuế lũy tiến cộng giảm trừ cá nhân + người phụ thuộc, rồi trừ phần 10% đã khấu trừ.',
    freelancerContractFooterForeign: 'Quyết toán cuối năm áp dụng biểu thuế lũy tiến cộng giảm trừ cá nhân + người phụ thuộc. Vì không có khấu trừ, bạn phải nộp toàn bộ khi quyết toán.',
    freelancerContractDescriptionForeign: 'Bạn ký hợp đồng dịch vụ với công ty nước ngoài không đăng ký thuế tại VN. Không bảo hiểm, không khấu trừ. Bạn tự kê khai TNCN hàng tháng và quyết toán cuối năm.',
    payerType: 'Bên Chi Trả',
    payerTypeDomestic: 'Công Ty Việt Nam',
    payerTypeForeign: 'Công Ty Nước Ngoài',
    payerTypeHint: 'Công ty nước ngoài (không đăng ký thuế tại VN) không thể khấu trừ TNCN — bạn phải tự kê khai và nộp toàn bộ TNCN lũy tiến.',
    foreignPayerNote: 'Bên chi trả nước ngoài: không khấu trừ. Bạn phải tự kê khai TNCN (hàng tháng trước ngày 20 tháng sau, và quyết toán năm).',
    annualPITOwed: 'Tổng TNCN Phải Nộp Cả Năm',
    selfDeclareWarning: 'Vì công ty nước ngoài không khấu trừ, bạn phải nộp toàn bộ TNCN lũy tiến khi quyết toán.',

    // Freelancer (Household Business)
    freelancerBusinessTitle: 'Thuế Freelancer (Hộ Kinh Doanh)',
    freelancerBusinessDescription: 'Bạn đăng ký hộ kinh doanh cá thể cung cấp dịch vụ. Từ 2026: bỏ thuế khoán, tự kê khai. Dịch vụ chịu VAT 5% + TNCN 2% trên doanh thu (Thông tư 40/2021/TT-BTC).',
    monthlyRevenue: 'Doanh Thu Hàng Tháng',
    annualRevenue: 'Doanh Thu Cả Năm',
    exemptThreshold: 'Ngưỡng Miễn Thuế',
    exemptStatus: 'Miễn Thuế — doanh thu dưới ngưỡng',
    notExemptStatus: 'Chịu Thuế — doanh thu vượt ngưỡng',
    vatLabel: 'VAT (5% doanh thu)',
    businessPITLabel: 'TNCN (2% doanh thu)',
    totalTaxLabel: 'Tổng Thuế (7% doanh thu)',
    annualVATLabel: 'VAT Cả Năm',
    annualPITLabel: 'TNCN Cả Năm',
    annualTotalTax: 'Tổng Thuế Cả Năm',
    freelancerBusinessFooter: 'Theo Nghị định 141/2026/NĐ-CP, hộ kinh doanh có doanh thu năm ≤ ₫1.000.000.000 được miễn VAT và TNCN.',
    perMonthSuffix: '/tháng',
    perYearSuffix: '/năm',
  },
};

export function t(key: string, language: Language = 'en'): string {
  return (translations[language] as any)[key] || (translations.en as any)[key] || key;
}
