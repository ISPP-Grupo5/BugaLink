export default function Entry({ children, title }) {
  return (
    <div className="flex flex-col leading-4">
      <p className="text-xs font-thin text-gray">{title}</p>
      <div className="flex flex-row items-center space-x-1 text-xs font-medium ">
        {children}
      </div>
    </div>
  );
}
