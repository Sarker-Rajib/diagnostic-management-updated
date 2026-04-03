export const calculateBillingProgress = ({
  selectedPatient,
  selectedServices,
  refBy,
  paidAmount,
  discount,
  subTotal,
}: any) => {
  let progress = 0;

  // Patient
  if (selectedPatient) progress += 25;

  // Services
  if (selectedServices?.length > 0) progress += 25;

  // Referral
  if (refBy) progress += 20;

  // Payment
  if (selectedServices?.length > 0) {
    const isFree = subTotal === discount;
    if (isFree || paidAmount > 0) {
      progress += 30;
    }
  }

  return progress;
};
