export const constants = {
  permissions: [
    "Super_Permission",
    "Admin_Permission",
    "Bill_Admin_Permission",
    "Bill_Permission",
    "Patient_op_Permission",
    "Reporting_Permission",
    "Limited_view",
  ],

  roles: [
    "Super-Admin",
    "Admin",
    "Technologist",
    "Doctor",
    "Nurse",
    "Bill-Officer",
    "User",
  ],

  CPaymentStatus: ["Paid", "Partial", "Unpaid"],
  CPaymentMethod: ["Cash", "Card", "Online"],

  division: ["Laboratory Services", "Radiology & Imaging", "Ultrasonography"],

  department: [
    "Haematology",
    "Biochemistry",
    "Clinical Pathology",
    "Histopathology & Cytopathology",
    "Microbiology",
    "Immunology",
    "Transfusion Medicine",
    "Ultrasonography",
    "Radiology & Imaging",
  ],

  reportGroup: [
    "CBC",
    "Coagulation",
    "Urine R/M/E",
    "Biochemistry",
    "Immunology",
    "Serology",
    "Widal",
    "Tripple Antigen",
    "Blood_Culture",
    "Urine_Culture",
    "Pus_Culture",
    "Stool_Culture",
    "CSF",
    "Histopathology",
    "Cytopathology",
    "Ultrasonography",
    "Radiology & Imaging",
    "N / A",
  ],

  testSample: [
    "Blood",
    "Urine",
    "Stool",
    "CSF",
    "Plueral Fluid",
    "Ascitic Fluid",
    "Synovial Fluid",
    "Body Tissue",
    "FNAC",
    "Skin Scraping",
    "N / A",
  ],

  reportPaper: {
    height: 11.2,
    width: 8.4,
    headingGap: 1.7,
    footerGap: 0.7,
    // in inch
  },
};
