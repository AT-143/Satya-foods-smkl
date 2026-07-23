import { WeightOption, CartItem, CustomerDetails } from '../types';
import { STORE_INFO } from '../data/products';

export function calculateWeightPrice(pricePerKg: number, weight: WeightOption): number {
  if (weight === '1kg') {
    return pricePerKg;
  }
  if (weight === '500g') {
    return Math.round(pricePerKg * 0.52);
  }
  if (weight === '250g') {
    return Math.round(pricePerKg * 0.28);
  }
  return pricePerKg;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppMessage(
  orderId: string,
  items: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  discount: number,
  deliveryFee: number,
  totalAmount: number,
  paymentMethod: string,
  lang: 'te' | 'en'
): string {
  const isTe = lang === 'te';

  let msg = `*${STORE_INFO.nameEn} (${STORE_INFO.nameTe})*\n`;
  msg += `📍 Samalkot Organics Order #${orderId}\n`;
  msg += `----------------------------------------\n`;
  msg += isTe ? `*ఆర్డర్ వివరాలు (Order Items):*\n` : `*Order Items:*\n`;

  items.forEach((item, index) => {
    const pName = isTe ? item.product.nameTe : item.product.nameEn;
    msg += `${index + 1}. ${pName} (${item.weight}) x ${item.quantity} = ${formatINR(item.unitPrice * item.quantity)}\n`;
  });

  msg += `----------------------------------------\n`;
  msg += isTe ? `మొత్తం వెల (Subtotal): ${formatINR(subtotal)}\n` : `Subtotal: ${formatINR(subtotal)}\n`;
  if (discount > 0) {
    msg += isTe ? `డిస్కౌంట్ (Discount): -${formatINR(discount)}\n` : `Discount: -${formatINR(discount)}\n`;
  }
  msg += isTe ? `డెలివరీ ఛార్జీలు (Delivery): ${deliveryFee === 0 ? 'ఉచితం (FREE)' : formatINR(deliveryFee)}\n` : `Delivery Charges: ${deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}\n`;
  msg += `*మొత్తం చెల్లించవలసినది (TOTAL): ${formatINR(totalAmount)}*\n`;
  msg += `పద్ధతి (Payment Method): ${paymentMethod}\n`;
  msg += `----------------------------------------\n`;
  msg += isTe ? `*వినియోగదారుని సమాచారం (Customer Info):*\n` : `*Customer Info:*\n`;
  msg += `పేరు (Name): ${customer.fullName}\n`;
  msg += `ఫోన్ (Phone): ${customer.phone}\n`;
  msg += `చిరునామా (Address): ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}\n`;
  if (customer.notes) {
    msg += `నోట్స్ (Notes): ${customer.notes}\n`;
  }
  msg += `\nదయచేసి నా ఆర్డర్ కన్ఫర్మ్ చేయగలరు. ధన్యవాదాలు! (Please confirm my order. Thank you!)`;

  return encodeURIComponent(msg);
}
