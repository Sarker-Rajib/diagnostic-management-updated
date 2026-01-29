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

// import { GroupBase, StylesConfig } from "react-select";
// export const customStyles: StylesConfig<
//   ISelectOption,
//   false,
//   GroupBase<ISelectOption>
// > = {
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#4F46E5"
//       : state.isFocused
//       ? "#E0E7FF"
//       : "white",
//     color: state.isSelected ? "white" : "#111827",
//     padding: 10,
//     cursor: "pointer",
//   }),
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#CBD5E0",
//     boxShadow: "none",
//     "&:hover": {
//       borderColor: "#A0AEC0",
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#1F2937",
//   }),
// };

// export interface ISelectData {
//   label: string;
//   value: string;
// }

// export const customStyleTwo: StylesConfig<
//   ISelectData,
//   false,
//   GroupBase<ISelectData>
// > = {
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#4F46E5"
//       : state.isFocused
//       ? "#E0E7FF"
//       : "white",
//     color: state.isSelected ? "white" : "#111827",
//     padding: 10,
//     cursor: "pointer",
//   }),
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#CBD5E0",
//     boxShadow: "none",
//     "&:hover": {
//       borderColor: "#A0AEC0",
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#1F2937",
//   }),
// };

export interface IPatientInfo {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  pId: string;
}

export interface IServiceItem {
  _id?: string;
  serviceName: string;
  testName: string;
  price: number;
  department: string;
  reportGroup: string;
  profile: string;
  serviceCode: string;
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
