import Glass from '/public/icons/Vista-Principal/glass.svg';
import Destino from 'public/icons/Vista-Principal/destino.svg';

export default function SearchBar() {
  return (
    <form className="flex w-full items-center rounded-full bg-white py-3 px-4">
      <Destino className="h-5 w-5 flex-none translate-y-0.5 scale-125 fill-light-turquoise stroke-light-turquoise" />
      <input
        type="search"
        placeholder="Dónde quieres ir?"
        className="ml-2 w-full rounded-full text-sm"
      />
      <button type="submit" data-cy="search-btn">
        <Glass />
      </button>
    </form>
  );
}
