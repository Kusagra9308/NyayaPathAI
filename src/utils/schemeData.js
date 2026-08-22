export const GOVT_SCHEMES = [
  {
    id: 'ayushman',
    name: 'Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY)',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'Healthcare',
    brief: 'World\'s largest health assurance scheme providing ₹5 Lakh cash-free health cover per family per year for secondary and tertiary care hospitalization.',
    benefits: '₹5,00,000 per family/year for inpatient hospitalization across 27,000+ empanelled hospitals.',
    maxIncomeLakhs: 2.5,
    documentsRequired: ['Aadhaar Card', 'Ration Card / SECC 2011 proof', 'Active Mobile Number', 'Bank Account details'],
    portalUrl: 'https://pmjay.gov.in'
  },
  {
    id: 'pmawas',
    name: 'Pradhan Mantri Awas Yojana (PMAY - Urban / Gramin)',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Housing',
    brief: 'Financial subsidy for construction or purchase of pucca house for Economically Weaker Sections (EWS) and Low Income Groups (LIG).',
    benefits: 'Direct Subsidy up to ₹2.67 Lakhs on housing loan interest rate.',
    maxIncomeLakhs: 6.0,
    documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Property Purchase Agreement', 'Bank Statement (6 Months)', 'Affidavit of No Pucca House'],
    portalUrl: 'https://pmaymis.gov.in'
  },
  {
    id: 'pmkisan',
    name: 'PM-KISAN Samman Nidhi',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Agriculture',
    brief: 'Direct Income Support of ₹6,000 per year transferred into bank accounts of land-holding farmer families.',
    benefits: '₹6,000 yearly in 3 equal installments of ₹2,000 directly to bank account.',
    targetOccupations: ['farmer', 'agriculture', 'landholder'],
    documentsRequired: ['Aadhaar Card', 'Land Ownership Records (Khatauni/Khasra)', 'Bank Passbook copy', 'e-KYC verification'],
    portalUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'eshram',
    name: 'e-Shram National Database of Unorganised Workers',
    ministry: 'Ministry of Labour and Employment',
    category: 'Employment & Social Security',
    brief: 'Unified database providing universal account number (UAN) and ₹2 Lakh free accidental death insurance for unorganized sector workers.',
    benefits: 'Universal UAN Card, ₹2 Lakh Accidental Death Cover, direct welfare benefit transfers.',
    minAge: 16,
    maxAge: 59,
    maxIncomeLakhs: 3.0,
    targetOccupations: ['construction', 'driver', 'vendor', 'domestic', 'tailor', 'artisan', 'worker', 'labour'],
    documentsRequired: ['Aadhaar Card (linked with mobile)', 'Bank Account details', 'Occupation detail'],
    portalUrl: 'https://eshram.gov.in'
  },
  {
    id: 'sukanya',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    ministry: 'Ministry of Finance / Women & Child Development',
    category: 'Child & Financial Security',
    brief: 'High-interest tax-free savings scheme for girl child education and marriage.',
    benefits: 'Highest government interest rate (8.2%+ p.a.), Section 80C tax deduction, guaranteed maturity.',
    maxAge: 10,
    documentsRequired: ['Birth Certificate of Girl Child', 'Identity & Address Proof of Parent/Guardian', 'Passport photos'],
    portalUrl: 'https://www.indiapost.gov.in'
  }
];

export function evaluateSchemeEligibility(citizen) {
  return GOVT_SCHEMES.map(scheme => {
    let score = 100;
    let reasons = [];

    if (scheme.minAge && citizen.age < scheme.minAge) {
      score -= 50;
      reasons.push(`Minimum age required is ${scheme.minAge} years (your age: ${citizen.age}).`);
    }
    if (scheme.maxAge && citizen.age > scheme.maxAge) {
      score -= 50;
      reasons.push(`Maximum age limit is ${scheme.maxAge} years.`);
    }

    if (scheme.maxIncomeLakhs && citizen.incomeLakhs > scheme.maxIncomeLakhs) {
      score -= 60;
      reasons.push(`Annual family income should be below ₹${scheme.maxIncomeLakhs} Lakhs (entered: ₹${citizen.incomeLakhs} Lakhs).`);
    }

    if (scheme.id === 'pmawas' && citizen.hasPuccaHouse) {
      score -= 80;
      reasons.push('Applicant family already owns a pucca house in India.');
    }

    if (scheme.id === 'pmkisan' && !citizen.hasLand) {
      score -= 70;
      reasons.push('Requires verifiable agricultural landholding records.');
    }

    const isEligible = score >= 50;

    return {
      scheme,
      score: Math.max(0, score),
      isEligible,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
