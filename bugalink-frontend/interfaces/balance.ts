type BalanceI = {
  amount: string; // Django returns DecimalField as string for avoiding float operations rounding issues
};

export default BalanceI;
