export const NALSA_ELIGIBILITY_CATEGORIES = [
  { id: 'woman_child', label: 'Woman or Child', section: 'Section 12(a) NALSA Act', isAutoEligible: true },
  { id: 'sc_st', label: 'Member of Scheduled Caste (SC) / Scheduled Tribe (ST)', section: 'Section 12(b) NALSA Act', isAutoEligible: true },
  { id: 'industrial_worker', label: 'Industrial Workman / Laborer', section: 'Section 12(f) NALSA Act', isAutoEligible: true },
  { id: 'disability', label: 'Person with Disability (PWD)', section: 'Section 12(d) NALSA Act', isAutoEligible: true },
  { id: 'trafficking_disaster', label: 'Victim of Human Trafficking, Disaster, or Violence', section: 'Section 12(c)/(e) NALSA Act', isAutoEligible: true },
  { id: 'custody', label: 'Person in Custody / Under-Trial Prisoner', section: 'Section 12(g) NALSA Act', isAutoEligible: true },
  { id: 'low_income', label: 'Low Annual Income Citizen (< Rs. 3,00,000 p.a.)', section: 'Section 12(h) NALSA Act', isAutoEligible: false }
];

export function checkNalsaEligibility(category, annualIncome) {
  const cat = NALSA_ELIGIBILITY_CATEGORIES.find(c => c.id === category) || NALSA_ELIGIBILITY_CATEGORIES[0];
  
  if (cat.isAutoEligible) {
    return {
      eligible: true,
      reason: `Statutory 100% Free Legal Aid Entitlement under ${cat.section} regardless of income.`,
      authority: 'District Legal Services Authority (DLSA)'
    };
  }

  const incomeNum = Number(annualIncome || 0);
  if (incomeNum <= 300000) {
    return {
      eligible: true,
      reason: `Eligible for Free Assigned Advocate under ${cat.section} (Annual income Rs. ${incomeNum.toLocaleString('en-IN')} is below statutory threshold of Rs. 3,00,000/- p.a.).`,
      authority: 'District Legal Services Authority (DLSA)'
    };
  }

  return {
    eligible: false,
    reason: `Annual income exceeds statutory ceiling of Rs. 3,00,000/- p.a. for general category. However, legal counseling remains available.`,
    authority: 'DLSA Front Office Legal Clinic'
  };
}

export function generateDlsaApplicationText(data, eligibility) {
  const cat = NALSA_ELIGIBILITY_CATEGORIES.find(c => c.id === data.category) || NALSA_ELIGIBILITY_CATEGORIES[0];

  return `APPLICATION FOR ASSIGNMENT OF FREE LEGAL AID ADVOCATE
UNDER SECTION 12 OF THE LEGAL SERVICES AUTHORITIES ACT, 1987

TO:
THE MEMBER SECRETARY / SECRETARY,
DISTRICT LEGAL SERVICES AUTHORITY (DLSA),
DISTRICT COURT COMPLEX, ${data.district ? data.district.toUpperCase() : '[DISTRICT]'}, ${data.state ? data.state.toUpperCase() : '[STATE]'}

1. APPLICANT DETAILS:
Full Name: ${data.applicantName || '[APPLICANT NAME]'}
Gender / Age: ${data.gender || 'Female'} | Age: ${data.age || '32'}
Address: ${data.applicantAddress || '[FULL ADDRESS]'}
Mobile: ${data.phone || '[PHONE]'} | Email: ${data.email || 'N/A'}
Annual Family Income: Rs. ${Number(data.annualIncome || 0).toLocaleString('en-IN')}/- p.a.

2. STATUTORY ENTITLEMENT CATEGORY:
Entitlement Ground: ${cat.label}
Statutory Provision: ${cat.section}
Eligibility Verdict: ${eligibility.eligible ? 'STATUTORILY ELIGIBLE FOR 100% FREE LEGAL AID & ADVOCATE' : 'SUBJECT TO SPECIAL DISCRETION'}

3. BRIEF DETAILS OF LEGAL DISPUTE / CASE:
${data.caseDetails || 'Applicant requires legal representation for a pending court matter / dispute.'}

4. PRAYER FOR ASSIGNMENT OF PANEL ADVOCATE:
In view of the above statutory entitlement under Section 12 of the Legal Services Authorities Act, 1987, it is humbly requested that:
(a) A Panel Advocate may kindly be assigned to represent the Applicant in the competent Court at 100% zero cost.
(b) All drafting, court fee, and litigation expenses may be borne by the District Legal Services Authority (DLSA).

VERIFICATION:
I, ${data.applicantName || '[APPLICANT NAME]'}, do hereby declare that the information provided above is true and correct to the best of my knowledge and belief.

Date: ${new Date().toLocaleDateString('en-IN')}
Place: ${data.district || 'District'}

___________________________
SIGNATURE / THUMB IMPRESSION OF APPLICANT`;
}
