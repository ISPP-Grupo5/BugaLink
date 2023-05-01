import ConfirmationScreen from '@/components/pages/confirmation';

export default function PayFail() {
  return (
    <ConfirmationScreen
      title="El pago no se ha realizado correctamente"
      description="Inténtalo de nuevo en unos instantes, sentimos las molestias"
      success={false}
    />
  );
}
