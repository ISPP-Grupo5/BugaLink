export default function PreferenceBox({ checked, setChecked, item }) {
  return (
    <div
      className={
        'grid min-h-full w-full cursor-pointer grid-rows-2 flex-col place-items-center rounded-lg border border-light-gray p-1 transition-colors duration-200 ' +
        (checked ? 'bg-white' : 'bg-light-gray')
      }
      onClick={() => {
        setChecked(!checked);
      }}
    >
      <p className="text-3xl">{item[checked ? 'checked' : 'unchecked'].icon}</p>
      <p className="text-center leading-5">
        {item[checked ? 'checked' : 'unchecked'].text}
      </p>
    </div>
  );
}
