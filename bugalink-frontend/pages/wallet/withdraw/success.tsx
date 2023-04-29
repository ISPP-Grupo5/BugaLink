import ConfirmationScreen from '@/components/pages/confirmation';

export default function WithdrawConfirmation() {
  return (
    <ConfirmationScreen
      title="¡Listo!"
      description="Tu solicitud ha sido recibida con éxito.El dinero se transferirá a tu cuenta en un plazo de 24-48 horas."
    />
  );
}
