import { LegalService } from '../types';

export const INITIAL_LEGAL_SERVICES: LegalService[] = [
  {
    id: 'legal-1',
    title: 'فحص سند الملكية والتسلسل القانوني',
    titleEn: 'Title Deed Due Diligence & Ownership History Audit',
    description: 'مراجعة وتدقيق المستندات القانونية وتاريخ تسلسل ملكية العقار للتأكد من خلوه من أي نزاعات قضائية أو رهونات بنكية أو مطالبات مالية مستحقة قبل إتمام الشراء.',
    descriptionEn: 'Rigorous legal inspection of title deeds, past ownership chains, and official registers to verify zero encumbrances, mortgages, or ongoing litigations before purchase.',
    iconName: 'FileCheck',
    features: [
      'فحص كشف التحديد المساحي وسند الملكية المسجل',
      'التحقق من عدم وجود نزاعات قضائية أو إشارات قيد',
      'مراجعة تراخيص البناء والمخططات المعتمدة',
      'إصدار تقرير سلامة قانونية أولي شامل وموثق'
    ],
    featuresEn: [
      'Cadastral survey & official title deed verification',
      'Checking absence of lawsuits or restrictive liens',
      'Reviewing municipal building licenses & blueprints',
      'Issuing an initial comprehensive legal safety report'
    ],
    estimatedDuration: '2 - 3 أيام عمل',
    isActive: true,
  },
  {
    id: 'legal-2',
    title: 'صياغة ومراجعة عقود البيع والإيجار الاحترافية',
    titleEn: 'Real Estate Sales & Tenancy Contract Drafting',
    description: 'صياغة عقود بيع وشراء أو إيجار ملزمة ومحكمة قانوناً تضمن حماية كاملة لحقوق الطرفين، وتحديد التزامات السداد، والتسليم، وغرامات التأخير، وبنود التحكيم.',
    descriptionEn: 'Custom drafting and legal audit of property sale, purchase, or long-term lease agreements, balancing rights, delivery timelines, penalty clauses, and dispute resolution.',
    iconName: 'FileText',
    features: [
      'صياغة بنود واضحة لجدول الأقساط وغرامات الإخلال',
      'تحديد مواصفات التسليم ومحاضر الاستلام المعتمدة',
      'شروط جزائية متوازنة تضمن حقوق الطرفين',
      'مراجعة بنود شركات التطوير العقاري قبل التوقيع'
    ],
    featuresEn: [
      'Clear installment schedules and breach penalties',
      'Strict handover specs and defect-liability clauses',
      'Balanced liquidated damages protecting both parties',
      'Reviewing developer off-plan sales contracts'
    ],
    estimatedDuration: '1 - 2 يوم عمل',
    isActive: true,
  },
  {
    id: 'legal-3',
    title: 'إجراءات التسجيل بالشهر العقاري ونقل التكليف',
    titleEn: 'Real Estate Notary Registration & Title Transfer',
    description: 'إرشاد قانوني تفصيلي ومتابعة خطوة بخطوة لإجراءات تسجيل العقارات بالشهر العقاري في مصر، سواء بالتسجيل الرضائي أو دعاوى صحة ونفاذ وسريان القانون الجديد.',
    descriptionEn: 'Step-by-step guidance and document preparation for registering Egyptian properties at the Real Estate Notary (El Shahr El Aqary), handling both consensual registration and judicial verification.',
    iconName: 'Scale',
    features: [
      'حساب الرسوم والمصاريف الإدارية والضريبية بدقة',
      'تجهيز ملف التسجيل ومراجعة أوراق التقديم',
      'استخراج شهادات التصرفات العقارية الرسمية',
      'التوجيه وفقاً لأحدث تعديلات قانون الشهر العقاري'
    ],
    featuresEn: [
      'Accurate tax & administrative fee estimation',
      'Complete dossier prep for digital registration portal',
      'Procurement of certified historical transaction records',
      'Compliance with the latest Real Estate Notary amendments'
    ],
    estimatedDuration: 'استشارة وتجهيز خلال 3 أيام',
    isActive: true,
  },
  {
    id: 'legal-4',
    title: 'استشارات التصالح وتراخيص البناء والمخالفات',
    titleEn: 'Building Violation Settlements & Licensing Guidance',
    description: 'تقديم الرأي القانوني والمشورة حول مدى مطابقة العقار لقوانين البناء والتصالح في مخالفات البناء رقم 187 لسنة 2023 وكيفية تقنين الأوضاع رسمياً.',
    descriptionEn: 'Expert guidance on property conformity with municipal building codes and reconciliation laws (Law 187/2023), guiding legalization and final clearance certificates.',
    iconName: 'ShieldCheck',
    features: [
      'دراسة موقف العقار من قانون التصالح الجديد',
      'حساب نسب المخالفة وجداول السداد المحتملة',
      'تحديد المستندات المطلوبة للجان الفنية الهندسية',
      'تجنب شراء وحدات صدر ضدها قرارات إزالة'
    ],
    featuresEn: [
      'Case evaluation under current reconciliation laws',
      'Fee estimations and phased payment options',
      'Checklist for engineering survey documentation',
      'Safety check against pending demolition orders'
    ],
    estimatedDuration: 'استشارة فورية خلال 24 ساعة',
    isActive: true,
  },
];
