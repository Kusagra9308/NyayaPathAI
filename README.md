# NyayaPath AI - Civic & Legal Empowerment Platform 🏛️✨

**Theme**: Civic Tech, Legal Access and Government Transparency  
**Challenge Statement**: Build an AI system that helps a citizen understand and act on their civic or legal rights, translating bureaucratic complexity into a clear, guided path.

---

## 🌟 Key Modules

### 1. ✍️ RTI (Right to Information) Drafting Agent
- **Translates Plain Language**: Converts everyday citizen queries into formal Section 6(1) RTI Applications.
- **Department Routing**: Automatically identifies competent Public Information Officers (PIOs) and government departments (PWD, Food & Civil Supplies, Municipal Water, Police, Social Welfare).
- **Legally Structured Questions**: Auto-formulates precise questions under the RTI Act 2005.
- **One-Click Export**: Download PDF or copy formatted draft with fee instructions.

### 2. 🛡️ Rights Navigator & Legal Notice Generator
- **Plain-English Legal Rights**: Explains rights for Tenant disputes, Consumer court claims, Workplace salary issues, and Cyber/Financial fraud.
- **Step-by-Step Action Plan**: Guided workflow from informal escalation to portal submission.
- **Pre-Litigation Legal Demand Notice Generator**: Creates 15-day statutory legal notices to send to landlords, employers, or companies before court proceedings.

### 3. 📜 Welfare Scheme Eligibility Reader
- **Plain Language Assessment**: Instant matching across Central & State schemes (Ayushman Bharat, PM Awas Yojana, PM-KISAN, e-Shram, Sukanya Samriddhi).
- **Document Checklist**: Provides exact document requirements and direct links to official application portals.

### 4. 📝 Conversational Form-Filler (CPGRAMS Grievance)
- **Interactive Interviewer**: Guides citizens through a friendly Q&A flow.
- **Auto-Populates CPGRAMS Form**: Generates official complaint text for `pgportal.gov.in`.

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
cd civic-rights-ai
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **PDF Engine**: jsPDF (Client-side instant PDF generation)
