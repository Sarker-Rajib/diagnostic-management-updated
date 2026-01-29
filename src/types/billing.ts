export interface IServiceBill {
  serviceId: string;
  serviceName: string;
  serviceCode: number;
  department: string;
  price: number;
  quantity?: number;
  total: number;
  status: "pending" | "in-progress" | "completed" | "cancelled" | "refunded";
  refundInfo?: {
    refundedBy: string;
    refundDate: string;
    refundAmount: number;
    reason?: string;
  };
  reportId?: string;
}

export interface IBilling {
  _id?: string;
  billId: string;
  pId: string;
  patientInfo: string;
  services: IServiceBill[];
  subTotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  billedBy: string;
  duePayments?: Array<{
    collectedBy: string;
    paymentMethod?: string;
    amount: number;
    date: string;
  }>;
  billRefund?: {
    refundedBy: string;
    refundDate: string;
    refundAmount: number;
    reason?: string;
  };
}
