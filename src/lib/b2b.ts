export const B2B_MINIMUM_ORDER_QUANTITY = 50

/**
 * Checks if a requested order quantity is valid for a given user role.
 * B2B buyers must order at least the minimum quantity.
 * 
 * @param role The user's role ('artisan', 'customer', 'b2b')
 * @param quantity The requested order quantity
 * @returns boolean true if valid, false otherwise
 */
export function isValidOrderQuantity(role: string, quantity: number): boolean {
  if (role === 'b2b') {
    return quantity >= B2B_MINIMUM_ORDER_QUANTITY
  }
  
  // Standard customers have no minimums, just a basic > 0 check
  return quantity > 0
}
