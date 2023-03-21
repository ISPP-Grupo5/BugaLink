import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import ArrowRightWhite from '/public/assets/arrow-right-white.svg';
import BugalinkLogo from '/public/icons/Bugalink.svg';
import VisaMastercard from '/public/assets/visa_mastercard 1.svg';
import Paypal from '/public/assets/paypal.svg';
import Link from 'next/link';

export default function Pay() {

  return (
    <AnimatedLayout className="flex flex-col justify-between">
        <BackButtonText text="Pago del viaje" />
        <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
            <div className="flex flex-col">
                <span className="font-bold text-2xl">Tus tarjetas</span>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center border border-dashed border-light-gray w-full rounded-xl my-2 p-12">
                        <p className='text-lg'>Saldo disponible</p>
                        <p className='font-bold text-5xl'>13,30€</p>
                    </div>
                    <div className="flex flex-col items-center justify-center border rounded-xl border-turquoise w-full my-2 p-4">
                        <p className='text-turquoise font-bold'> <span className='border border-turquoise rounded-xl px-2 py-1'>+</span>  Añadir método de pago</p>
                    </div>
                </div>
            </div>
            <br/>
            <div className="flex flex-col">
                <span className="font-bold text-2xl">Métodos de pago</span>
                <div className="flex flex-col items-center justify-center">
                    <PayMethod logo={<BugalinkLogo color="white" />} name='Saldo' data='13,30€' href='#' />
                    <PayMethod logo={<VisaMastercard />} name='VISA/Mastercard' data='**** **** **** 5678' href='#' />
                    <PayMethod logo= {<Paypal />}  name='Paypal' data='pedro@gmail.com' href='#' />
                </div>
            </div>
        </div>
    </AnimatedLayout>
  );
}

type PayMethodProps = {
    logo: any;
    name: string;
    data: string;
    href: string;
}

export function PayMethod ({logo, name, data, href} : PayMethodProps) {
    return (
        <div className="grid grid-cols-3 items-center justify-center border rounded-xl border-light-gray w-full my-2 p-2 h-32 shadow-md">
            <div className={`p-4 m-auto rounded-xl h-4/6 ${name=='Saldo' ? 'bg-turquoise' : 'bg-light-gray'}`}>{logo}</div>
            <div>
                <p className='font-bold text-lg'>{name}</p>
                <p className='text-sm text-gray'>{data}</p>
            </div>
            <div className='ml-auto mr-1'>
                <Link href={href}>
                    <p className={` bg-turquoise rounded-xl px-2 py-3 ${name=='Saldo' ? 'bg-turquoise' : 'bg-black'}`}>
                        <ArrowRightWhite/>
                    </p>
                </Link>
            </div>
        </div>
    )
}

