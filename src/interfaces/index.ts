import { department, reportGroup } from "@/constants";

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
  department: (typeof department)[number];
  reportGroup: (typeof reportGroup)[number];
  profile?: string;
  serviceCode?: number;
  createdAt?: string;
  updatedAt?: string;
}
