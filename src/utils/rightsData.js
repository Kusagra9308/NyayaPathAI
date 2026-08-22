export const DISPUTE_CATEGORIES = [
  {
    id: 'tenant',
    title: 'Tenant & Housing Rights',
    icon: 'Home',
    description: 'Security deposit withholding, sudden rent hikes, unlawful eviction notices, or maintenance refusal.',
    relevantLaw: 'Model Tenancy Act / State Rent Control Act',
    officialPortalUrl: 'https://pgportal.gov.in',
    portalName: 'Rent Authority / Housing Tribunal',
    rightsSummary: [
      'Landlord cannot evict without 30 days mandatory notice and valid legal order.',
      'Security deposit MUST be refunded within 30 days of tenancy end minus actual receipted damages.',
      'Landlord cannot cut off essential services (water, electricity, internet) under any circumstances.',
      'Rent increases cannot exceed agreed terms in the registered rental agreement.'
    ],
    actionSteps: [
      { step: 1, title: 'Send Pre-Litigation Legal Notice', detail: 'Issue a formal 15-day notice specifying deposit amount and legal consequences.' },
      { step: 2, title: 'Gather Evidence', detail: 'Collect rent receipts, lease agreement, WhatsApp chats, and move-out inspection photos.' },
      { step: 3, title: 'File Complaint with Rent Controller', detail: 'Submit a petition to the local Rent Authority or Consumer Commission.' }
    ]
  },
  {
    id: 'consumer',
    title: 'Consumer Court & E-Commerce Disputes',
    icon: 'ShoppingBag',
    description: 'Defective products, false advertisement, denied refunds, airline delays, or service deficiency.',
    relevantLaw: 'Consumer Protection Act, 2019 & E-Commerce Rules',
    officialPortalUrl: 'https://consumerhelpline.gov.in',
    portalName: 'National Consumer Helpline (NCH / INGRAM)',
    rightsSummary: [
      'Right to full refund or replacement for defective goods within warranty/guarantee period.',
      'E-commerce platforms are legally liable for counterfeit items and misleading delivery promises.',
      'No extra hidden charges or cancellation penalties exceeding original service cost.',
      'Consumer can file online case on e-Daakhil portal from their home city without hiring a lawyer.'
    ],
    actionSteps: [
      { step: 1, title: 'Lodge NCH Grievance', detail: 'Call 1915 or register complaint on National Consumer Helpline (NCH).' },
      { step: 2, title: 'Send Formal Demand Notice', detail: 'Send a 15-day written legal notice to company customer grievance head.' },
      { step: 3, title: 'File on e-Daakhil', detail: 'Submit online complaint on edaakhil.nic.in for claims up to ₹50 Lakhs.' }
    ]
  },
  {
    id: 'workplace',
    title: 'Workplace & Salary Disputes',
    icon: 'Briefcase',
    description: 'Unpaid salary/FNF settlement, wrongful termination, maternity leave denial, or contract breach.',
    relevantLaw: 'Industrial Disputes Act & Payment of Wages Act',
    officialPortalUrl: 'https://samadhan.labour.gov.in',
    portalName: 'SAMADHAN Portal / Labour Commissioner',
    rightsSummary: [
      'Full and Final (FNF) settlement must be paid within 48 hours of resignation/termination.',
      'Employer cannot withhold salary for notice period non-serving if paid in lieu.',
      'Maternity Benefit Act entitles female employees to 26 weeks paid leave.',
      'Gratuity is mandatory for employees serving continuously for 5+ years.'
    ],
    actionSteps: [
      { step: 1, title: 'HR Escalation Letter', detail: 'Send formal demand letter detailing unpaid months, PF numbers, and dates.' },
      { step: 2, title: 'File on SAMADHAN Portal', detail: 'Register industrial dispute online with Ministry of Labour & Employment.' },
      { step: 3, title: 'Labour Commissioner Complaint', detail: 'Submit petition for recovery of wages before District Labour Conciliation Officer.' }
    ]
  },
  {
    id: 'cyber',
    title: 'Cyber & Banking Financial Fraud',
    icon: 'ShieldAlert',
    description: 'Unauthorized bank debit, UPI fraud, phishing, fake loan apps, or identity theft.',
    relevantLaw: 'RBI Zero Liability Circular & IT Act, 2000',
    officialPortalUrl: 'https://cybercrime.gov.in',
    portalName: 'National Cyber Crime Reporting Portal (Helpline 1930)',
    rightsSummary: [
      'ZERO liability for citizen if unauthorized transaction reported to bank within 3 days.',
      'Bank must credit disputed amount back to account within 10 working days.',
      'Unregistered loan apps cannot threaten or harass contacts under RBI Digital Lending Guidelines.',
      'Cyber Police must register complaint and issue acknowledgement receipt.'
    ],
    actionSteps: [
      { step: 1, title: 'Call 1930 Cyber Helpline Immediately', detail: 'Report transaction reference within 2 hours ("Golden Hour") to freeze scammer bank account.' },
      { step: 2, title: 'Submit Written Complaint to Bank Manager', detail: 'Obtain acknowledged copy of unauthorized transaction report.' },
      { step: 3, title: 'File Online on CyberCrime.gov.in', detail: 'Upload bank statement, screenshot, and transaction IDs.' }
    ]
  }
];

export function generateLegalNoticeText(
  category,
  senderName,
  senderAddress,
  receiverName,
  receiverAddress,
  amountClaimed,
  incidentDetails
) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `PRE-LITIGATION LEGAL DEMAND NOTICE

REGISTERED AD / SPEED POST

Date: ${currentDate}

TO,
${receiverName || 'Opposite Party / Management'},
${receiverAddress || 'Address of Opposite Party'}

FROM,
${senderName || 'Aggrieved Citizen'},
${senderAddress || 'Address of Sender'}

SUBJECT: DEMAND NOTICE FOR REMITTANCE OF ₹${amountClaimed || '0'}/- AND IMMEDIATE RESOLUTION OF GRIEVANCE

Sir/Madam,

Under instructions from and on behalf of my client/self (${senderName}), I hereby serve upon you this formal Demand Notice:

1. STATUTE & RECITALS:
   That you (the Addressee) entered into a lawful relationship/transaction regarding "${incidentDetails}".

2. FACTS OF GRIEVANCE:
   ${incidentDetails || 'Detailed facts of breach of contract / non-refund / failure of service.'}

3. LEGAL VIOLATION:
   That your refusal to address this matter constitutes a clear violation of consumer rights, statutory protections, and terms of contract under Indian law.

4. DEMAND:
   You are hereby called upon to pay/refund the sum of ₹${amountClaimed || '0'}/- along with interest at 18% p.a. within FIFTEEN (15) DAYS from the receipt of this notice.

5. CONSEQUENCE OF DEFAULT:
   Take notice that if you fail to comply with the demands within 15 days, appropriate legal proceedings (Civil, Criminal, or Consumer Protection Commission) will be instituted against you entirely at your risk, cost, and consequence.

SENDER SIGNATURE,


(${senderName || 'Aggrieved Citizen'})
`;
}
