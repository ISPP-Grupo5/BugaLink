export default function MobileLayout({ children }) {
  return (
    // Base layout for new pages. Should have the same proportion as a phone
    <div className="mobile-view-parent justify-center bg-base-origin md:p-2">
      <div className="mobile-view relative outline outline-2 outline-light-gray">
        {children}
      </div>
    </div>
  );
}
