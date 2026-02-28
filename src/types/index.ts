import { constants } from "@/constants";

export interface IUser {
  _id: string;
  fullName: string;
  permissions: string;
  position: string;
  role: string;
  userId: string;
  username: string;
}

export interface IPatient {
  _id?: string;
  fullName: string;
  gender: string;
  age: string | number;
  phoneNumber: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  pId: string;
}

export interface IPrescription {
  markedTooth: {
    upperRight: string;
    upperLeft: string;
    lowerRight: string;
    lowerLeft: string;
  };
  _id: string;
  patientInfo: {
    _id: string;
    fullName: string;
    age: number;
    sex: string;
    gender: string;
    pId: string;
  };
  patientId: string;
  doctorId: {
    _id: string;
    position: string;
    fullName: string;
  };
  medications: {
    name: string;
    frequency: string;
    duration: string;
    instructions: string;
    _id: string;
  }[];
  chiefComplains: string[];
  observationExamination: string[];
  generelAdvice: string[];
  diagnosticAdvice: string[];
  createdAt: string;
  updatedAt: string;
  prescriptionId: string;
}

export interface ITestRefData {
  _id?: string;
  refName: string;
  testName: string;
  unit: string;
  priority: number;
  referenceRange: string;
}

export interface IPatientInfo {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  pId: string;
}

export interface IServiceItem {
  _id?: string;
  serviceCode: string;
  serviceName: string;
  testName: string;
  price: number;
  division: string;
  department: string;
  reportGroup: string;
  panel: boolean;
}

export interface IBilledBy {
  _id?: string;
  username: string;
  fullName: string;
}

export interface IBill {
  _id: string;
  patientInfo: IPatientInfo;
  services: IServiceItem[];
  subTotal: number;
  totalAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  billedBy: IBilledBy;
  duePayments?: [];
  createdAt: string;
  updatedAt: string;
  billId: string;
}

export interface IInvoice {
  _id: string;
  pId: string;
  billId: string;
  patientInfo: IPatientData;
  services: IServiceItem[];
  subTotal: number;
  totalAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  billedBy: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IPatientData {
  _id?: string;
  fullName: string;
  gender?: string;
  age: number;
  phoneNumber: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  pId: string;
}

export interface IExpense {
  _id?: string;
  purpose: string;
  amount: number;
  // doneBy: string;
}

export interface IInstrumentBuy {
  _id?: string;
  itemName: string;
  quantity: number;
  amount: number;
  // doneBy: string;
}

export interface IUserData {
  _id: string;
  username: string;
  role: string;
  position: string;
  fullName: string;
  permissions: string[];
  status: string;
  createdAt: string; // or Date if you're converting to Date objects
  updatedAt: string; // or Date
  userId: string;
  email: string;
}

export interface ITokenUser {
  _id: string;
  username: string;
  role: string;
  position: string;
  fullName: string;
  permissions: string[];
  userId: string;
  iat: number;
  exp: number;
}

export interface IMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IServiceData {
  _id?: string;
  serviceName: string;
  testName: string;
  price: number;
  division: (typeof constants.division)[number];
  department: (typeof constants.department)[number];
  reportGroup: (typeof constants.reportGroup)[number];
  panel: boolean;
  serviceCode?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITestPanel {
  _id?: string;
  refPanelName: string;
  panelName: string;
  tests: [string];
  priority: number;
  isPanel: boolean;
}

export interface ITestPanelFull {
  _id?: string;
  refPanelName: string;
  panelName: string;
  tests: [ITestRefData];
  priority: number;
  isPanel: boolean;
}
