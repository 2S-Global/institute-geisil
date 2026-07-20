import {
  ShieldCheck,
  Zap,
  Lock,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  CreditCard,
  FileCheck,
  Book,
  Contact,
  Landmark,
  Car,
  IdCard,
  ReceiptText,
  UserCheck,
  Fingerprint,
  Quote,
  Star,
  Lightbulb,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  ShieldAlert,
} from "lucide-react";
export const slides = [
  {
    title: "KYC Verification",
    subtitle: "Instant, secure identity checks",
    desc: "Aadhaar, PAN, GST and more — verify in seconds with bank-grade encryption.",
  },
  {
    title: "Employability Reimagined",
    subtitle: "Build a workforce you can trust",
    desc: "Background checks and credential verification that scale from 10 to 10 million records.",
  },
  {
    title: "Compliance Made Simple",
    subtitle: "Regulator-ready by default",
    desc: "Aligned with RBI, SEBI, and UIDAI frameworks — audit logs and reports included.",
  },
];

export const services = [
  {
    icon: Fingerprint,
    title: "Aadhaar",
    desc: "Validates a resident's identity by cross-referencing the unique 12-digit number with the central database. It ensures the associated demographic data matches perfectly, preventing identity theft and securing digital onboarding.",
    color: "#51b311",
  },
  {
    icon: CreditCard,
    title: "Permanent Account Number (PAN)",
    desc: "Verifies the 10-digit alphanumeric financial identifier issued by the Income Tax Department. This process confirms the individual's or business's active tax status, legal name, and validity for high-value financial transactions.",
    color: "#FE7503",
  },
  {
    icon: Book,
    title: "Passport",
    desc: "Checks the legitimacy of national travel documents against global or consular databases. It instantly authenticates the booklet number, full name, nationality, and expiry date to ensure international compliance.",
    color: "#1B8E43",
  },
  {
    icon: Contact,
    title: "Electors Photo Identity Card (EPIC)",
    desc: "Validates the Electors Photo Identity Card number directly with the Election Commission's national electoral roll. This step confirms local residential status, voter registration validity, and basic citizen demographic details.",
    color: "#8D99C0",
  },
  {
    icon: Car,
    title: "Driving Licence",
    desc: "Queries road transport authorities to check license status, categories of vehicles permitted, and active validity. This step acts as both a robust photo identity check and an essential operational screen.",
    color: "#bb5e12b4",
  },
  {
    icon: IdCard,
    title: "Universal Account Number (UAN)",
    desc: "Verifies the permanent number assigned to employees covered under the Employees' Provident Fund Organisation (EPFO). It confirms employment registry history, formal job status, and corporate onboarding continuity.",
    color: "#18b0bbab",
  },
  {
    icon: Landmark,
    title: "Bank Account Number",
    desc: "Utilizes micro-pennies or instant banking API hits to match bank accounts with specific names. This safeguards monetary disbursements, ensures direct benefit transfers, and cuts down on accidental transactional errors.",
    color: "#22db9d",
  },
  {
    icon: ReceiptText,
    title: "Goods and Services Tax (GST)",
    desc: "Instantly verifies corporate tax registration status via the GST Network (GSTN). This ensures the business is active, files its returns regularly, and is a legally recognized entity for trade commerce.",
    color: "#bcc535",
  },
  {
    icon: Building2,
    title: "Know Your Business (KYB)",
    desc: "Conducts extensive background checks on corporate entities, tracking ownership structures, ultimate beneficial owners (UBOs), and legal filings. It ensures complete regulatory safety before entering business-to-business partnerships.",
    color: "#35c518",
  },
  {
    icon: GraduationCap,
    title: "Academic Records",
    desc: "Cross-references electronic degree certificates, marks sheets, and graduation dates directly against institutional registrars. This eliminates resume inflation, fake credentials, and academic misrepresentation for recruiters.",
    color: "#a7c210",
  },
  {
    icon: BriefcaseBusiness,
    title: "Professional Records",
    desc: "Validates past employment histories, previous job titles, durations of work, and certifications. This provides hiring managers with reliable operational records, reducing candidate onboarding risks.",
    color: "#cca010c7",
  },
  {
    icon: ShieldAlert,
    title: "Criminal Records",
    desc: "Scans state, federal, and local legal databases, court records, and police registries for any active matches or legal liabilities. It helps organizations remain highly compliant while safeguarding workplace trust.",
    color: "#ec2b09",
  },
];

export const partners = ["Razorpay", "NSDL", "UIDAI", "NPCI", "SEBI", "MCA"];

export const testimonials = [
  {
    name: "Priya Sharma",
    role: "Head of Ops, FinEdge",
    quote:
      "GEISIL cut our onboarding time from 3 days to under 5 minutes. The API is rock solid and the dashboard is a dream.",
  },
  {
    name: "Rahul Verma",
    role: "CTO, LendKart",
    quote:
      "The pay-per-verification model is exactly what a growing lender needs. Compliance reports save hours every week.",
  },
  {
    name: "Aisha Khan",
    role: "Compliance Lead, PayNova",
    quote:
      "Best-in-class accuracy. We rely on GEISIL for every customer onboarding — zero downtime in the last year.",
  },
];

export const stats = [
  { value: "2.4M+", label: "Corporates" },
  { value: "130K+", label: "Institutes" },
  { value: "26M+", label: "Employees" },
  { value: "40k+", label: "Verifications" },
];
