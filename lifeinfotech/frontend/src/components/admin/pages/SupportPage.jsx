import React, { useState } from "react";
import { Mail, Search, FolderOpen } from "lucide-react";

const SupportPage = () => {
  const [status, setStatus] = useState("All Status");
  const [priority, setPriority] = useState("All Priority");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen font-sans">

      {/* Header */}
      <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6">
        <Mail className="text-yellow-500" size={26} />
        Support Ticket
        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-sm">
          0
        </span>
      </h1>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center mb-6">

        {/* Search */}
        <div className="flex">
          <div className="flex items-center bg-white border border-slate-300 rounded-l-lg px-3">
            <Search size={16} className="text-slate-400" />
          </div>

          <input
            type="text"
            placeholder="Search ticket by subject"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border-y border-slate-300 px-3 py-2 outline-none w-64"
          />

          <button className="bg-blue-600 text-white px-5 rounded-r-lg hover:bg-blue-700">
            Search
          </button>
        </div>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-white border border-slate-300 px-4 py-2 rounded-lg outline-none"
        >
          <option>All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white border border-slate-300 px-4 py-2 rounded-lg outline-none"
        >
          <option>All Status</option>
          <option>Open</option>
          <option>Close</option>
        </select>
      </div>

      <hr className="mb-10 border-slate-200" />

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <FolderOpen size={90} className="mb-4 opacity-60" />
        <p className="text-lg">No support ticket found</p>
      </div>
    </div>
  );
};

export default SupportPage;
