import crypto from 'crypto';

function generateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function getSeedData() {
  const plots = [
    {
      plotId: 'PLOT-1042',
      mouza: 'Dhanmondi (CS/RS 14)',
      khatianNumber: 'KH-4491',
      dagNumber: 'DAG-8821',
      sampleArea: '0.0825 Acre (5.0 Katha)',
      district: 'Dhaka',
      subDistrict: 'Dhanmondi',
      landCategory: 'Residential Urban',
      currentRecordedOwner: {
        id: 'S-01',
        name: 'Rafiqul Islam',
        nid: 'NID-1981-2691-0041'
      },
      status: 'Active',
      notes: 'Prime commercial/residential boundary parcel facing Satmasjid Road.'
    },
    {
      plotId: 'PLOT-2001',
      mouza: 'Gulshan (RS 08)',
      khatianNumber: 'KH-1022',
      dagNumber: 'DAG-3301',
      sampleArea: '0.1000 Acre (6.0 Katha)',
      district: 'Dhaka',
      subDistrict: 'Gulshan',
      landCategory: 'Residential',
      currentRecordedOwner: {
        id: 'B-21',
        name: 'Dr. Shahana Parveen',
        nid: 'NID-1975-4421-9982'
      },
      status: 'Active',
      notes: 'Clean title history with synchronized deed and mutation records.'
    },
    {
      plotId: 'PLOT-3005',
      mouza: 'Uttara Model Town (Sector 7)',
      khatianNumber: 'KH-7812',
      dagNumber: 'DAG-5510',
      sampleArea: '0.0660 Acre (4.0 Katha)',
      district: 'Dhaka',
      subDistrict: 'Uttara',
      landCategory: 'Residential',
      currentRecordedOwner: {
        id: 'B-31',
        name: 'Mustafizur Rahman',
        nid: 'NID-1988-5110-3321'
      },
      status: 'Active',
      notes: 'Prior draft deed cancelled due to mutual rescission; subsequent deed legally registered.'
    },
    {
      plotId: 'PLOT-4010',
      mouza: 'Mirpur (Section 10)',
      khatianNumber: 'KH-6632',
      dagNumber: 'DAG-1109',
      sampleArea: '0.0500 Acre (3.0 Katha)',
      district: 'Dhaka',
      subDistrict: 'Mirpur',
      landCategory: 'Commercial',
      currentRecordedOwner: {
        id: 'S-40',
        name: 'Tariqul Alam',
        nid: 'NID-1969-9021-4412'
      },
      status: 'Active',
      notes: 'Registered owner Tariqul Alam has no verified record of authorizing transfer.'
    },
    {
      plotId: 'PLOT-5020',
      mouza: 'Banani (Block C)',
      khatianNumber: 'KH-8840',
      dagNumber: 'DAG-4412',
      sampleArea: '0.0750 Acre (4.5 Katha)',
      district: 'Dhaka',
      subDistrict: 'Banani',
      landCategory: 'Commercial',
      currentRecordedOwner: {
        id: 'B-50',
        name: 'Farzana Begum',
        nid: 'NID-1984-7712-3390'
      },
      status: 'Active',
      notes: 'Deed conveyance issued to Farzana Begum; mutation ledger mismatch observed.'
    },
    {
      plotId: 'PLOT-6030',
      mouza: 'Tejgaon Industrial Area',
      khatianNumber: 'KH-9102',
      dagNumber: 'DAG-7740',
      sampleArea: '0.1650 Acre (10.0 Katha)',
      district: 'Dhaka',
      subDistrict: 'Tejgaon',
      landCategory: 'Industrial',
      currentRecordedOwner: {
        id: 'S-60',
        name: 'Apex Manufacturing Assets Ltd',
        nid: 'NID-CO-882190'
      },
      status: 'Active',
      notes: 'Deed registration number duplicated in distinct registry book volume.'
    },
    {
      plotId: 'PLOT-7040',
      mouza: 'Bashundhara R/A (Block G)',
      khatianNumber: 'KH-3319',
      dagNumber: 'DAG-9912',
      sampleArea: '0.0825 Acre (5.0 Katha)',
      district: 'Dhaka',
      subDistrict: 'Vatara',
      landCategory: 'Residential',
      currentRecordedOwner: {
        id: 'S-70',
        name: 'Nayeem Chowdhury',
        nid: 'NID-1990-1122-7788'
      },
      status: 'Active',
      notes: 'Derivative conveyance executed despite cancelled root conveyance.'
    }
  ];

  // Deeds with verifiable text and document hashes
  const deed1Text = 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 14,500,000.';
  const deed2Text = 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-B between Seller Rafiqul Islam (S-01) and Buyer Kamal Hossain (B-02) for Plot PLOT-1042. Consideration BDT 15,200,000.';
  const deed3Text = 'SUB-REGISTRY GULSHAN: Fictional Deed 2025-1022-L between Seller Kabir Ahmed (S-20) and Buyer Dr. Shahana Parveen (B-21) for Plot PLOT-2001.';
  const deed4Cancelled = 'SUB-REGISTRY UTTARA: Draft Deed 2024-5510-C between S-30 and Buyer X. CANCELLED by District Registrar on 2024-06-15.';
  const deed4Valid = 'SUB-REGISTRY UTTARA: Deed 2025-5510-V between S-30 and Mustafizur Rahman (B-31) for Plot PLOT-3005.';

  const deeds = [
    // PLOT-1042 (Hackathon Primary Scenario)
    {
      deedRef: 'DEED-2026-0042-A',
      plotId: 'PLOT-1042',
      sellerId: 'S-01',
      sellerName: 'Rafiqul Islam',
      buyerId: 'B-01',
      buyerName: 'Anisur Rahman',
      deedDate: '2026-01-14',
      registrationOffice: 'Dhanmondi Sub-Registry Office',
      deedValueBDT: 14500000,
      status: 'Registered',
      documentHash: generateHash(deed1Text),
      sampleDocumentContent: deed1Text,
      remarks: 'Primary sale deed executed in Book 1, Volume 42.'
    },
    {
      deedRef: 'DEED-2026-0042-B',
      plotId: 'PLOT-1042',
      sellerId: 'S-01',
      sellerName: 'Rafiqul Islam',
      buyerId: 'B-02',
      buyerName: 'Kamal Hossain',
      deedDate: '2026-02-02',
      registrationOffice: 'Dhanmondi Sub-Registry Office',
      deedValueBDT: 15200000,
      status: 'Registered',
      documentHash: generateHash(deed2Text),
      sampleDocumentContent: deed2Text,
      remarks: 'Second active deed executed without cancellation of Deed 2026-0042-A.'
    },

    // PLOT-2001 (Normal / Legitimate)
    {
      deedRef: 'DEED-2025-1022-L',
      plotId: 'PLOT-2001',
      sellerId: 'S-20',
      sellerName: 'Kabir Ahmed',
      buyerId: 'B-21',
      buyerName: 'Dr. Shahana Parveen',
      deedDate: '2025-05-18',
      registrationOffice: 'Gulshan Sub-Registry Office',
      deedValueBDT: 28000000,
      status: 'Registered',
      documentHash: generateHash(deed3Text),
      sampleDocumentContent: deed3Text,
      remarks: 'Complete legal conveyance with complete mutation.'
    },

    // PLOT-3005 (Cancelled prior deed, valid current deed)
    {
      deedRef: 'DEED-2024-5510-C',
      plotId: 'PLOT-3005',
      sellerId: 'S-30',
      sellerName: 'Abul Kashem',
      buyerId: 'B-99',
      buyerName: 'Unverified Entity X',
      deedDate: '2024-04-10',
      registrationOffice: 'Uttara Sub-Registry Office',
      deedValueBDT: 11000000,
      status: 'Cancelled',
      documentHash: generateHash(deed4Cancelled),
      sampleDocumentContent: deed4Cancelled,
      remarks: 'Formally cancelled by Deed Cancellation Order #881/2024.'
    },
    {
      deedRef: 'DEED-2025-5510-V',
      plotId: 'PLOT-3005',
      sellerId: 'S-30',
      sellerName: 'Abul Kashem',
      buyerId: 'B-31',
      buyerName: 'Mustafizur Rahman',
      deedDate: '2025-02-11',
      registrationOffice: 'Uttara Sub-Registry Office',
      deedValueBDT: 12500000,
      status: 'Registered',
      documentHash: generateHash(deed4Valid),
      sampleDocumentContent: deed4Valid,
      remarks: 'Legitimate transfer post-cancellation of defective draft.'
    },

    // PLOT-4010 (Seller/Owner Conflict)
    {
      deedRef: 'DEED-2026-4010-X',
      plotId: 'PLOT-4010',
      sellerId: 'S-99',
      sellerName: 'Jahangir Kabir (Unauthorized)',
      buyerId: 'B-41',
      buyerName: 'Sadia Akhter',
      deedDate: '2026-03-01',
      registrationOffice: 'Mirpur Sub-Registry Office',
      deedValueBDT: 9500000,
      status: 'Pending',
      documentHash: generateHash('Mirpur Deed 2026-4010-X S-99 to B-41'),
      sampleDocumentContent: 'Mirpur Sub-Registry Deed 2026-4010-X submitted by Jahangir Kabir claiming inheritance.',
      remarks: 'Seller S-99 has no record of ownership in Khatian KH-6632.'
    },

    // PLOT-5020 (Registry / Mutation Mismatch)
    {
      deedRef: 'DEED-2025-5020-B',
      plotId: 'PLOT-5020',
      sellerId: 'S-50',
      sellerName: 'Mohammad Younus',
      buyerId: 'B-50',
      buyerName: 'Farzana Begum',
      deedDate: '2025-09-20',
      registrationOffice: 'Banani Sub-Registry Office',
      deedValueBDT: 22000000,
      status: 'Registered',
      documentHash: generateHash('Banani Deed 2025-5020-B Younus to Farzana Begum'),
      sampleDocumentContent: 'Deed 2025-5020-B conveying Plot PLOT-5020 to Farzana Begum.',
      remarks: 'Registered deed legally assigns parcel to Farzana Begum.'
    },

    // PLOT-6030 (Duplicate Deed Ref)
    {
      deedRef: 'DEED-DUP-9901',
      plotId: 'PLOT-6030',
      sellerId: 'S-60',
      sellerName: 'Apex Manufacturing Assets Ltd',
      buyerId: 'B-61',
      buyerName: 'Prime Logistics BD',
      deedDate: '2026-01-22',
      registrationOffice: 'Tejgaon Sub-Registry Office',
      deedValueBDT: 45000000,
      status: 'Registered',
      documentHash: generateHash('Tejgaon Deed DEED-DUP-9901 for Plot 6030'),
      sampleDocumentContent: 'Deed DEED-DUP-9901 registered at Tejgaon office for Plot PLOT-6030.',
      remarks: 'Primary registration for industrial parcel.'
    },

    // PLOT-7040 (Inconsistent Transfer Sequence)
    {
      deedRef: 'DEED-7040-01-CAN',
      plotId: 'PLOT-7040',
      sellerId: 'S-70',
      sellerName: 'Nayeem Chowdhury',
      buyerId: 'B-70',
      buyerName: 'Intermediate Broker Co',
      deedDate: '2025-07-10',
      registrationOffice: 'Gulshan Sub-Registry Office',
      deedValueBDT: 18000000,
      status: 'Cancelled',
      documentHash: generateHash('Deed 7040-01 Cancelled conveyance'),
      sampleDocumentContent: 'Intermediate deed voided due to non-clearance of stamp duty.',
      remarks: 'Voided deed.'
    },
    {
      deedRef: 'DEED-7040-02-DER',
      plotId: 'PLOT-7040',
      sellerId: 'B-70',
      sellerName: 'Intermediate Broker Co',
      buyerId: 'B-72',
      buyerName: 'Engr. Mahmudul Hasan',
      deedDate: '2025-11-15',
      registrationOffice: 'Gulshan Sub-Registry Office',
      deedValueBDT: 19500000,
      status: 'Pending',
      documentHash: generateHash('Deed 7040-02 Derivative conveyance to Mahmudul'),
      sampleDocumentContent: 'Deed 7040-02 executed relying on cancelled deed 7040-01.',
      remarks: 'Purported downstream sale.'
    }
  ];

  const transfers = [
    // PLOT-1042
    {
      transferId: 'TR-1042-01',
      plotId: 'PLOT-1042',
      deedRef: 'DEED-2026-0042-A',
      sellerId: 'S-01',
      sellerName: 'Rafiqul Islam',
      buyerId: 'B-01',
      buyerName: 'Anisur Rahman',
      transferStatus: 'Active',
      dependsOnTransferId: null,
      transferDate: '2026-01-14',
      notes: 'First active transfer registered in Sub-Registry.'
    },
    {
      transferId: 'TR-1042-02',
      plotId: 'PLOT-1042',
      deedRef: 'DEED-2026-0042-B',
      sellerId: 'S-01',
      sellerName: 'Rafiqul Islam',
      buyerId: 'B-02',
      buyerName: 'Kamal Hossain',
      transferStatus: 'Active',
      dependsOnTransferId: null,
      transferDate: '2026-02-02',
      notes: 'Second active transfer recorded while TR-1042-01 remains active.'
    },

    // PLOT-2001 (Normal)
    {
      transferId: 'TR-2001-01',
      plotId: 'PLOT-2001',
      deedRef: 'DEED-2025-1022-L',
      sellerId: 'S-20',
      sellerName: 'Kabir Ahmed',
      buyerId: 'B-21',
      buyerName: 'Dr. Shahana Parveen',
      transferStatus: 'Active',
      dependsOnTransferId: null,
      transferDate: '2025-05-18',
      notes: 'Regular title succession.'
    },

    // PLOT-3005 (Cancelled vs Valid)
    {
      transferId: 'TR-3005-01',
      plotId: 'PLOT-3005',
      deedRef: 'DEED-2024-5510-C',
      sellerId: 'S-30',
      sellerName: 'Abul Kashem',
      buyerId: 'B-99',
      buyerName: 'Unverified Entity X',
      transferStatus: 'Cancelled',
      dependsOnTransferId: null,
      transferDate: '2024-04-10',
      notes: 'Cancelled before execution.'
    },
    {
      transferId: 'TR-3005-02',
      plotId: 'PLOT-3005',
      deedRef: 'DEED-2025-5510-V',
      sellerId: 'S-30',
      sellerName: 'Abul Kashem',
      buyerId: 'B-31',
      buyerName: 'Mustafizur Rahman',
      transferStatus: 'Active',
      dependsOnTransferId: null,
      transferDate: '2025-02-11',
      notes: 'Lawful single active conveyance.'
    },

    // PLOT-4010 (Seller/Owner Conflict)
    {
      transferId: 'TR-4010-01',
      plotId: 'PLOT-4010',
      deedRef: 'DEED-2026-4010-X',
      sellerId: 'S-99',
      sellerName: 'Jahangir Kabir (Unauthorized)',
      buyerId: 'B-41',
      buyerName: 'Sadia Akhter',
      transferStatus: 'Pending',
      dependsOnTransferId: null,
      transferDate: '2026-03-01',
      notes: 'Transfer submitted by non-owner S-99.'
    },

    // PLOT-5020 (Registry/Mutation Mismatch)
    {
      transferId: 'TR-5020-01',
      plotId: 'PLOT-5020',
      deedRef: 'DEED-2025-5020-B',
      sellerId: 'S-50',
      sellerName: 'Mohammad Younus',
      buyerId: 'B-50',
      buyerName: 'Farzana Begum',
      transferStatus: 'Active',
      dependsOnTransferId: null,
      transferDate: '2025-09-20',
      notes: 'Active deed transfer to Farzana Begum.'
    },

    // PLOT-6030 (Duplicate Deed Ref across multiple transfers)
    {
      transferId: 'TR-6030-01',
      plotId: 'PLOT-6030',
      deedRef: 'DEED-DUP-9901',
      sellerId: 'S-60',
      sellerName: 'Apex Manufacturing Assets Ltd',
      buyerId: 'B-61',
      buyerName: 'Prime Logistics BD',
      transferStatus: 'Active',
      dependsOnTransferId: null,
      transferDate: '2026-01-22',
      notes: 'Original transaction on Plot 6030.'
    },
    {
      transferId: 'TR-9999-DUP',
      plotId: 'PLOT-1042', // Same deed reused on another plot!
      deedRef: 'DEED-DUP-9901',
      sellerId: 'S-60',
      sellerName: 'Apex Manufacturing Assets Ltd',
      buyerId: 'B-88',
      buyerName: 'Shadow Holdings',
      transferStatus: 'Pending',
      dependsOnTransferId: null,
      transferDate: '2026-02-15',
      notes: 'Fraudulent or collided deed reference reuse attempt.'
    },

    // PLOT-7040 (Inconsistent Sequence)
    {
      transferId: 'TR-7040-01',
      plotId: 'PLOT-7040',
      deedRef: 'DEED-7040-01-CAN',
      sellerId: 'S-70',
      sellerName: 'Nayeem Chowdhury',
      buyerId: 'B-70',
      buyerName: 'Intermediate Broker Co',
      transferStatus: 'Cancelled',
      dependsOnTransferId: null,
      transferDate: '2025-07-10',
      notes: 'Parent conveyance cancelled.'
    },
    {
      transferId: 'TR-7040-02',
      plotId: 'PLOT-7040',
      deedRef: 'DEED-7040-02-DER',
      sellerId: 'B-70',
      sellerName: 'Intermediate Broker Co',
      buyerId: 'B-72',
      buyerName: 'Engr. Mahmudul Hasan',
      transferStatus: 'Pending',
      dependsOnTransferId: 'TR-7040-01',
      transferDate: '2025-11-15',
      notes: 'Secondary sale depends on cancelled TR-7040-01.'
    }
  ];

  const mutations = [
    // PLOT-1042: Mutation still lists Buyer B-01 (Anisur Rahman)
    {
      mutationId: 'MUT-1042-01',
      plotId: 'PLOT-1042',
      caseNumber: 'MUT-CASE-2026/8801',
      recordedOwnerId: 'B-01',
      recordedOwnerName: 'Anisur Rahman',
      linkedDeedRef: 'DEED-2026-0042-A',
      khatianNumber: 'KH-4491-MUT',
      status: 'Approved',
      mutationDate: '2026-01-28',
      acLandOffice: 'Dhanmondi Circle AC (Land) Office',
      dakhilaNumber: 'DAK-2026-99120'
    },

    // PLOT-2001: Mutation matches deed buyer Dr. Shahana Parveen
    {
      mutationId: 'MUT-2001-01',
      plotId: 'PLOT-2001',
      caseNumber: 'MUT-CASE-2025/1109',
      recordedOwnerId: 'B-21',
      recordedOwnerName: 'Dr. Shahana Parveen',
      linkedDeedRef: 'DEED-2025-1022-L',
      khatianNumber: 'KH-1022-MUT',
      status: 'Approved',
      mutationDate: '2025-06-05',
      acLandOffice: 'Gulshan Circle AC (Land) Office',
      dakhilaNumber: 'DAK-2025-44102'
    },

    // PLOT-3005: Mutation matches Mustafizur Rahman
    {
      mutationId: 'MUT-3005-01',
      plotId: 'PLOT-3005',
      caseNumber: 'MUT-CASE-2025/3301',
      recordedOwnerId: 'B-31',
      recordedOwnerName: 'Mustafizur Rahman',
      linkedDeedRef: 'DEED-2025-5510-V',
      khatianNumber: 'KH-7812-MUT',
      status: 'Approved',
      mutationDate: '2025-03-01',
      acLandOffice: 'Uttara Circle AC (Land) Office',
      dakhilaNumber: 'DAK-2025-77821'
    },

    // PLOT-5020: Mutation record disagrees! Lists Enamul Haque instead of Farzana Begum!
    {
      mutationId: 'MUT-5020-01',
      plotId: 'PLOT-5020',
      caseNumber: 'MUT-CASE-2025/9944',
      recordedOwnerId: 'M-99',
      recordedOwnerName: 'Enamul Haque (Unverified Applicant)',
      linkedDeedRef: 'DEED-2025-5020-B',
      khatianNumber: 'KH-8840-DEF',
      status: 'Approved',
      mutationDate: '2025-10-15',
      acLandOffice: 'Banani Circle AC (Land) Office',
      dakhilaNumber: 'DAK-2025-33011'
    }
  ];

  const auditLogs = [
    {
      logId: 'LOG-INIT-001',
      action: 'SYSTEM_INITIALIZATION',
      reviewerId: 'SYS-ADMIN',
      reviewerName: 'PlotGuard Seed Engine',
      timestamp: new Date('2026-10-16T08:00:00Z'),
      affectedRecordRefs: ['PLOT-1042', 'PLOT-2001', 'PLOT-3005', 'PLOT-4010', 'PLOT-5020', 'PLOT-6030', 'PLOT-7040'],
      details: 'PlotGuard repository initialized with fictional land registry records for Hackathon evaluation.'
    }
  ];

  return {
    plots,
    deeds,
    transfers,
    mutations,
    alerts: [],
    auditLogs
  };
}
