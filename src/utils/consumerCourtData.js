export const CONSUMER_DISPUTE_TYPES = [
  {
    id: 'e_commerce',
    title: 'E-Commerce & Online Shopping Refund',
    actSection: 'Section 2(47) - Unfair Trade Practice & E-Commerce Rules 2020',
    forum: 'District Consumer Disputes Redressal Commission',
    defaultFacts: 'Non-delivery / defective item delivered by seller and refusal to process 100% refund despite repeated follow-ups.'
  },
  {
    id: 'defective_product',
    title: 'Defective Product / Appliance Failure',
    actSection: 'Section 2(10) & Section 84 - Product Liability',
    forum: 'District Consumer Disputes Redressal Commission',
    defaultFacts: 'Product failed within warranty period. Authorized service center refused repair / replacement without valid grounds.'
  },
  {
    id: 'service_deficiency',
    title: 'Service Deficiency (Telecom / Banking / Insurance / Flight)',
    actSection: 'Section 2(11) - Deficiency of Service',
    forum: 'District Consumer Disputes Redressal Commission',
    defaultFacts: 'Deficiency of service, failure to process legitimate insurance claim or flight cancellation refund.'
  },
  {
    id: 'real_estate',
    title: 'Real Estate / Builder Possession Delay',
    actSection: 'Section 2(11) & RERA Cross-Reference',
    forum: 'State / District Consumer Commission',
    defaultFacts: 'Builder failed to deliver possession of flat within agreed timeframe specified in Apartment Buyer Agreement.'
  }
];

export function generateConsumerPetitionText(data) {
  const productPrice = Number(data.productPrice || 0);
  const agonyCompensation = Number(data.agonyCompensation || 10000);
  const litigationCosts = Number(data.litigationCosts || 5000);
  const totalClaim = productPrice + agonyCompensation + litigationCosts;

  const dispute = CONSUMER_DISPUTE_TYPES.find(d => d.id === data.disputeType) || CONSUMER_DISPUTE_TYPES[0];

  return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
AT ${data.district ? data.district.toUpperCase() : 'DISTRICT'}, ${data.state ? data.state.toUpperCase() : 'STATE'}

COMPLAINT PETITION NO: _______ OF 2026
UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019
PORTAL COMPLIANT DRAFT FOR E-DAAKHIL (edaakhil.nic.in)

IN THE MATTER OF:

${data.complainantName || '[COMPLAINANT NAME]'}
S/D/W o: Resident of ${data.complainantAddress || '[ADDRESS]'}
Mobile: ${data.complainantPhone || '[PHONE]'} | Email: ${data.complainantEmail || '[EMAIL]'}
... COMPLAINANT

VERSUS

${data.oppositePartyName || '[OPPOSITE PARTY / TRADER / COMPANY NAME]'}
Registered Office Address: ${data.oppositePartyAddress || '[ADDRESS OF OPPOSITE PARTY]'}
... OPPOSITE PARTY

STATEMENT OF FACTS:

1. That the Complainant is a "Consumer" as defined under Section 2(7) of the Consumer Protection Act, 2019, having purchased goods / availed services for personal use.

2. That on ${data.purchaseDate || 'Date'}, the Complainant purchased / availed services from the Opposite Party vide Invoice / Order Ref No: ${data.invoiceNo || '[INVOICE / ORDER NO]'} for a total sum of Rs. ${productPrice.toLocaleString('en-IN')}/-.

3. SUBSTANTIAL DISPUTE & DEFICIENCY:
${data.factsSummary || dispute.defaultFacts}

4. CAUSE OF ACTION & STATUTORY PROVISIONS:
That the cause of action arose when the Opposite Party refused to resolve the grievance. The acts of the Opposite Party amount to "Deficiency of Service" under ${dispute.actSection} of the Consumer Protection Act, 2019.

5. JURISDICTION:
That this Hon'ble Commission has territorial jurisdiction under Section 34(2) as the Complainant resides/works within the local limits of this Commission, and pecuniary jurisdiction as the total claim value is within Rs. 50 Lakhs.

PRAYER / RELIEF CLAIMED:

In view of the facts stated above, the Complainant most respectfully prays that this Hon'ble Commission may be pleased to:

(a) Direct the Opposite Party to refund / pay a sum of Rs. ${productPrice.toLocaleString('en-IN')}/- along with interest @ 12% p.a. from the date of purchase till realization.

(b) Direct the Opposite Party to pay Rs. ${agonyCompensation.toLocaleString('en-IN')}/- as compensation for mental agony, distress, and administrative harassment suffered by the Complainant.

(c) Direct the Opposite Party to pay Rs. ${litigationCosts.toLocaleString('en-IN')}/- towards litigation expenses incurred by the Complainant.

TOTAL MONETARY RELIEF CLAIMED: RS. ${totalClaim.toLocaleString('en-IN')}/-

VERIFICATION AFFIDAVIT
I, ${data.complainantName || '[COMPLAINANT NAME]'}, do hereby solemnly affirm and state that the contents of paragraphs 1 to 5 of the above complaint are true and correct to my personal knowledge. Verified at ${data.district || 'City'} on this day of 2026.

___________________________
DEPONENT / COMPLAINANT`;
}
