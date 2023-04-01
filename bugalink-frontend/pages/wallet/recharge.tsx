import CreditOperation from '@/components/payment/CreditOperation';

export default function Recharge() {
  return (
    <CreditOperation
      textBackButton="Recargar saldo"
      title="Métodos para recargar saldo"
      textAddButton="Añadir método para recargar saldo"
    />
  );
}
