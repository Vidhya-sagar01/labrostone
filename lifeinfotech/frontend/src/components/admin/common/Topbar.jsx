const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <button onClick={toggleSidebar} className="md:hidden text-2xl">☰</button>
      
      <div className="hidden md:block text-gray-500 font-medium">
        Life Infotech Admin System
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-green-100 text-green-700 p-2 rounded-full">🔔</div>
        <div className="flex items-center gap-2 border-l pl-4">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold">A</div>
          <span className="text-sm font-semibold">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;