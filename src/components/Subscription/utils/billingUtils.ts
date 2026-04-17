export const TAX_RATE = 0.07;

export const calculateTax = (subtotal: number) => {
  return subtotal * TAX_RATE;
};

export const calculateDiscount = (basePrice: number, couponCode: string) => {
  if (couponCode.toUpperCase() === 'SAVE10') {
    return basePrice * 0.1;
  }
  return 0;
};

export const formatCurrency = (amount: number) => {
  return amount.toFixed(2);
};
