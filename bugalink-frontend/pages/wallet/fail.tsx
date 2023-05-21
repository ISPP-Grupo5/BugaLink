import ConfirmationScreen from '@/components/pages/confirmation';

export default function WalletFail() {
  return (
    <ConfirmationScreen
      title="La solicitud no se ha procesado correctamente"
      description="Inténtalo de nuevo en unos instantes, sentimos las molestias"
      success={false}
    />
  );
}
