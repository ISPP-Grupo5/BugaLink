import Glass from '/public/icons/Vista-Principal/glass.svg';
import Destino from 'public/icons/Vista-Principal/destino.svg';

export default function SearchBar() {
  return (
    <form className="flex py-3 px-4 w-full bg-white rounded-full items-center">
      <Destino className="w-5 h-5 stroke-light-turquoise fill-light-turquoise flex-none scale-125 translate-y-0.5" />
      <input
        type="search"
        placeholder="Dónde quieres ir?"
        className="w-full text-sm rounded-full ml-2"
      ></input>
      <button type="submit" className="">
        <Glass />
      </button>
    </form>
  );
}
