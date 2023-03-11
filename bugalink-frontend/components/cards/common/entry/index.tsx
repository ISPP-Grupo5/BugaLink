export default function Entry({ children, title }) {
  return (
    <div className="flex flex-col leading-4">
      <p className="font-thin text-xs text-gray">{title}</p>
      <div className="flex flex-row space-x-1 items-center font-medium text-xs ">
        {children}
      </div>
    </div>
  );
}
