# 🎨 GEISIL Institute Frontend — Design System & Style Guide

Welcome to the Design System and Style Guide for the **GEISIL Institute Dashboard** frontend. This document describes the design tokens, visual aesthetics, color codes, layouts, and typography used across the system. It serves as a single source of truth for developers and designers working on the project.

---

## 🎨 Color Palette & Visual System

The GEISIL Institute dashboard is designed with a **professional, corporate navy and white aesthetic**, supported by clean slate grays and restrained accent colors. All colors are defined as CSS variables using **HSL (Hue, Saturation, Lightness)** to allow for easy theme switching and opacity adjustments.

### ☀️ Light Mode Theme (Default)

Below is the color palette configuration defined in `src/index.css` under the `:root` pseudo-class.

| Variable Token | HSL Code | HEX Value | RGB Code | Visual Block | Description |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `--background` | `210 25% 98%` | `#F8FAFC` | `rgb(248, 250, 252)` | `█` | Light mode page background (Slate 50) |
| `--foreground` | `222 45% 14%` | `#0F172A` | `rgb(15, 23, 42)` | `█` | Main typography / body text (Slate 900) |
| `--card` | `0 0% 100%` | `#FFFFFF` | `rgb(255, 255, 255)` | `█` | Card backgrounds, table panels |
| `--card-foreground` | `222 45% 14%` | `#0F172A` | `rgb(15, 23, 42)` | `█` | Text inside card panels |
| `--popover` | `0 0% 100%` | `#FFFFFF` | `rgb(255, 255, 255)` | `█` | Tooltips, dropdown overlays, popovers |
| `--popover-foreground`| `222 45% 14%` | `#0F172A` | `rgb(15, 23, 42)` | `█` | Text inside popover elements |
| **`--primary`** | `220 70% 22%` | `#11295F` | `rgb(17, 41, 95)` | `█` | Deep corporate navy; used for primary buttons, active states |
| `--primary-hover` | `220 70% 17%` | `#0D1F49` | `rgb(13, 31, 73)` | `█` | Darker navy for primary action hover states |
| `--primary-soft` | `220 60% 96%` | `#F3F6FC` | `rgb(243, 246, 252)` | `█` | Very light navy tint for info cards, badges, light highlights |
| `--secondary` | `215 25% 95%` | `#F1F5F9` | `rgb(241, 245, 249)` | `█` | Alternating rows, input fields, tags (Slate 100) |
| `--secondary-foreground`| `222 45% 14%` | `#0F172A` | `rgb(15, 23, 42)` | `█` | Text inside secondary containers |
| `--muted` | `215 25% 96%` | `#F4F6F9` | `rgb(244, 246, 249)` | `█` | Disabled components, read-only areas |
| `--muted-foreground` | `218 14% 45%` | `#64748B` | `rgb(100, 116, 139)`| `█` | Labels, helper text, subtitles (Slate 500) |
| **`--accent`** | `215 80% 50%` | `#1A73E8` | `rgb(26, 115, 232)` | `█` | Accent blue for interactive links, focused components |
| `--accent-foreground` | `0 0% 100%` | `#FFFFFF` | `rgb(255, 255, 255)` | `█` | Text inside accented containers |
| **`--success`** | `152 60% 36%` | `#15803D` | `rgb(21, 128, 61)` | `█` | Emitted green for success alerts, checkmarks, verified scores |
| **`--warning`** | `35 92% 50%` | `#F59E0B` | `rgb(245, 158, 11)` | `█` | Pending reviews, draft modes, warnings (Amber 500) |
| **`--destructive`** | `0 75% 50%` | `#DC2626` | `rgb(220, 38, 38)` | `█` | High-risk actions, cancellations, deletions (Red 600) |
| `--border` | `215 22% 90%` | `#E2E8F0` | `rgb(226, 232, 240)`| `█` | Separators, table borders, border lines (Slate 200) |
| `--input` | `215 22% 90%` | `#E2E8F0` | `rgb(226, 232, 240)`| `█` | Form inputs outline border |
| `--ring` | `220 70% 22%` | `#11295F` | `rgb(17, 41, 95)` | `█` | Focus ring outline for buttons, inputs, accessibility |

---

### 🌙 Dark Mode Theme

When the dark mode class `.dark` is added to the HTML/Body element, the styling variables map to a deep-space layout:

| Variable Token | HSL Code | HEX Value | RGB Code | Visual Block | Description |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `--background` | `222 45% 8%` | `#0B0F19` | `rgb(11, 15, 25)` | `█` | Dark background |
| `--foreground` | `210 30% 96%` | `#F1F5F9` | `rgb(241, 245, 249)` | `█` | Light body typography |
| `--card` | `222 40% 11%` | `#111827` | `rgb(17, 24, 39)` | `█` | Dark card panels |
| `--card-foreground` | `210 30% 96%` | `#F1F5F9` | `rgb(241, 245, 249)` | `█` | Card text colors |
| `--primary` | `215 80% 60%` | `#3B82F6` | `rgb(59, 130, 246)` | `█` | Electric blue highlighting primary actions |
| `--primary-foreground`| `222 45% 8%` | `#0B0F19` | `rgb(11, 15, 25)` | `█` | Text inside primary actions in dark mode |
| `--secondary` | `222 30% 16%` | `#1F2937` | `rgb(31, 41, 55)` | `█` | Dark inputs and panel sections |
| `--muted` | `222 30% 16%` | `#1F2937` | `rgb(31, 41, 55)` | `█` | Disabled input areas |
| `--muted-foreground` | `218 14% 65%` | `#9CA3AF` | `rgb(156, 163, 175)`| `█` | Secondary text captions |
| `--accent` | `215 80% 55%` | `#3B82F6` | `rgb(59, 130, 246)` | `█` | Focal action borders and items |
| `--border` | `222 30% 18%` | `#374151` | `rgb(55, 65, 81)` | `█` | Table lines and box borders |

---

### 🗂️ Sidebar Theme Configuration

The sidebars use a specialized high-contrast colorway in both light and dark modes to define clean visual hierarchies:

*   **Sidebar Background**: `220 70% 22%` (`#11295F` - Dark Navy Blue)
*   **Sidebar Foreground**: `210 30% 88%` (`#CBD5E1` - Soft light blue-gray)
*   **Sidebar Primary Highlights**: `0 0% 100%` (`#FFFFFF` - Pure white active tags)
*   **Sidebar Accent/Hover Block**: `220 60% 28%` (`#1D3A7A` - Secondary dark navy)
*   **Sidebar Border**: `220 50% 30%` (`#264483` - Mid-tone divider border)

---

## 📐 Layouts, Spacing & Shadows

### Border Radius
*   `var(--radius)`: `0.625rem` (10px) — applied to main layout cards, dialog panels, and major sections.
*   **Medium components** (inputs, buttons): `calc(var(--radius) - 2px)` = `8px`.
*   **Small components** (badges, small tags, tooltips): `calc(var(--radius) - 4px)` = `6px`.

### Brand Elevation & Shadows
*   **Shadow Sm** (`--shadow-sm`): `0 1px 2px 0 hsl(220 40% 15% / 0.04)` (Flat content)
*   **Shadow Md** (`--shadow-md`): `0 4px 12px -2px hsl(220 40% 15% / 0.08)` (Normal card overlays)
*   **Shadow Lg** (`--shadow-lg`): `0 16px 40px -12px hsl(220 40% 15% / 0.18)` (Modals and dropdown overlays)
*   **Shadow Brand** (`--shadow-brand`): `0 12px 32px -8px hsl(220 70% 22% / 0.35)` (Brand accent glow)

### Custom Scrollbar Styling
*   **Width**: `6px` for Chrome/Safari/Edge, thin for Firefox.
*   **Track background**: Transparent.
*   **Thumb color**: Slate-300 (`rgb(203, 213, 225)`) defaulting to Slate-400 (`rgb(148, 163, 184)`) on hover.

---

## 🔤 Typography & Font System

Configured directly inside `tailwind.config.ts`:

1.  **Main Body Sans Font**: `Inter`, `system-ui`, `sans-serif`
    *   *Usage*: Dashboard tables, labels, form input text, secondary text, reports.
2.  **Display Heading Font**: `Plus Jakarta Sans`, `Inter`, `system-ui`, `sans-serif`
    *   *Usage*: Dashboard page titles, hero headers, marketing/CMS page displays, statistical values.

---

## 👥 Role-Based Layouts & Routing Architecture

Routing is managed in `src/App.tsx` through conditional validation matching user permissions. There are 4 major accounts supported by the system:

### 👑 1. Admin Area (`/admin/*` | Role `"0"`)
*Layout components: `AdminLayout`, `AdminSidebar`*
*   **AdminDashboard**: System-wide performance and metrics.
*   **AdminListCompany**: Employer account validations and actions.
*   **VerificationCms**: Manage content updates, KYC rules.
*   **WhyGEISIL / ManageBanners / AboutPageCms / ManageServices**: Front-facing marketing CMS.
*   **BehavioralTest / PersonalityTest**: Control test parameters.

### 🎓 2. Institute Console (`/institute/*` | Role `"3"`)
*Layout components: `DashboardLayout`, `AppSidebar`*
*   **Students / StudentDetail / AllStudentList / StudentSearch**: Search, manage profiles, compile bulk lists.
*   **ManageCampus / ManageCourses**: Set campus coordinates and course requirements.
*   **Recruiters / RecruiterDetail / RequirementDetail**: Connect with placement companies.
*   **Evaluations / Placements / Reports**: Academic assessments and employment statistics reports.
*   **Faculty / FacultyDetail**: Manage professor directory and qualifications.
*   **InstituteProfile / InstituteProfileDetails**: Update college/university description.

### 💼 3. Employer Portal (`/employer/*` | Role `"2"`)
*Layout components: `EmployerLayout`, `EmployerSidebar`*
*   **EmployerDashboard / CompanyProfile**: Corporate workspace overview.
*   **Jobs / PostNewJob / ReviewJobs / EditJobs**: Post job listings, assign evaluations.
*   **Candidates / CandidateDetail / CandidatesList / Applications**: Review applicants and test performance.
*   **Interviews / Assessments**: Set interview schedules and test evaluations.
*   **VerifyEmployee / AadharVerification / EmployeeVerification**: Run background security checks.
*   **PayNow**: Integration with Razorpay for credits/subscriptions.

### 👤 4. Candidate Area (`/candidate/*` | Role `"1"`)
*Layout components: `CandidateLayout`, `CandidateSidebar`*
*   **CandidateDashboard / Profile / AppliedJobs**: Overview of matches and progress.
*   **CandidateJobs / CandidateJobDetail / SavedJobs**: Job listings exploration.
*   **CandidateInterviews / CandidateNotifications**: Communications hub.
*   **CandidateAssessments / BehavioralAssessment / PersonalityAssessment**: Aptitude test answers portals.

---

## 🛠️ Technological Base

The frontend project utilizes a modern single page application (SPA) architecture:
1.  **Vite + React (TS)**: High-speed developer compilation environment.
2.  **Tailwind CSS**: Core utility design engine.
3.  **Radix UI**: Primitive controls styled using Tailwind (Accordion, Alert Dialog, Dialog, Hover Card, Menubar, Navigation Menu, Select, Tabs, etc.).
4.  **Tanstack React Query (v5)**: Backend API caching, polling, and mutations.
5.  **Axios**: Custom endpoint base handler (`src/lib/axios.ts`).
6.  **Razorpay**: Embedded payment validation processing for employer and candidate verifications.
7.  **Lucide React**: Clean vector icon suite.
8.  **Recharts**: SVG graphing engine for reports.
9.  **Framer Motion**: Smooth component entry/exit micro-animations.
