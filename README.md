# NyayaPath AI - Civic & Legal Empowerment Platform

NyayaPath AI is an AI-powered system designed to help citizens understand and act on their civic and legal rights, translating bureaucratic complexity into a clear, guided path. It empowers individuals by providing tools for government transparency and legal access.

## Key Modules

### 1. RTI (Right to Information) Drafting Agent
-   **Translates Plain Language**: Converts everyday citizen queries into formal Section 6(1) RTI Applications.
-   **Department Routing**: Automatically identifies competent Public Information Officers (PIOs) and government departments (e.g., PWD, Food & Civil Supplies, Police).
-   **Legally Structured Questions**: Auto-formulates precise questions under the RTI Act 2005 based on the user's query.
-   **One-Click Export**: Download a formatted PDF or copy the draft with fee instructions, ready for submission.

### 2. Rights Navigator & Legal Notice Generator
-   **Plain-English Legal Rights**: Explains statutory rights for common disputes involving Tenants, Consumer court claims, Workplace salary issues, and Cyber/Financial fraud.
-   **Step-by-Step Action Plan**: Provides a guided workflow, from informal escalation to filing official complaints.
-   **Pre-Litigation Legal Notice Generator**: Creates 15-day statutory legal demand notices to send to landlords, employers, or companies before initiating court proceedings.

### 3. Welfare Scheme Eligibility Reader
-   **Plain Language Assessment**: Instantly matches a citizen's profile against Central & State government welfare schemes like Ayushman Bharat, PM Awas Yojana, PM-KISAN, and e-Shram.
-   **Document Checklist**: Provides exact document requirements and direct links to official application portals for each matched scheme.

### 4. Conversational Form-Filler (CPGRAMS Grievance)
-   **Interactive Interviewer**: Guides citizens through a simple Q&A flow to gather details about a public grievance.
-   **Auto-Populates CPGRAMS Form**: Generates official complaint text ready to be submitted on the CPGRAMS portal (`pgportal.gov.in`).

## Tech Stack

-   **Framework**: React 18 + Vite
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **PDF Engine**: jsPDF (for client-side PDF generation)

## Quick Start

Follow these instructions to get a local copy up and running.

### 1. Clone the repository
```bash
git clone https://github.com/kusagra9308/nyayapathai.git
```

### 2. Navigate to the project directory
```bash
cd nyayapathai
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.
