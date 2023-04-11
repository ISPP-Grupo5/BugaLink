export default function AnimatedLayout({ children, className = '' }) {
  return (
    // NOTE: removed transition animation between pages

    <div className={'h-screen w-full bg-base-origin font-lato ' + className}>
      {children}
    </div>
  );
}
