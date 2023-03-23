import { BackButtonText } from "../buttons/Back";
import AnimatedLayout from "../layouts/animated";
import AddMethod from "./AddMethod";
import PayMethod from "./PayMethod";
import BugalinkLogo from '/public/icons/Bugalink.svg';
import VisaMastercard from '/public/assets/visa_mastercard 1.svg';
import Paypal from '/public/assets/paypal.svg';

type CreditOperationProps = {
    textBackButton: string;
    title: string;
    textAddButton: string;
};

export default function CreditOperation({textBackButton, title, textAddButton} : CreditOperationProps) {
    return (
        <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text={textBackButton} />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
            <AddMethod text={textAddButton} />
        <br />
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{title}</span>
          <div className="flex flex-col items-center justify-center">
            <PayMethod
              logo={<VisaMastercard />}
              name="VISA/Mastercard"
              data="**** **** **** 5678"
              href="#"
            />
            <PayMethod
              logo={<Paypal />}
              name="Paypal"
              data="pedro@gmail.com"
              href="#"
            />
          </div>
        </div>
      </div>
    </AnimatedLayout>
    );
};