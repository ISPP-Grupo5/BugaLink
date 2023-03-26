import Recargar from '/public/assets/recargar.svg';

type AddMethodProps = {
  text: string;
};

export default function AddMethod({ text }: AddMethodProps) {
  return (
    <div className="my-2 flex w-full flex-col items-center justify-center rounded-xl border border-turquoise p-4">
      <p className="inline-flex font-bold text-turquoise">
        <Recargar /> &nbsp;&nbsp;{text}
      </p>
    </div>
  );
}
