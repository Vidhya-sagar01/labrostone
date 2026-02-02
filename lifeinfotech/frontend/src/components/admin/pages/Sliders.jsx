import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Slider = () => {
  const navigate = useNavigate();

  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const initialForm = { title: '', image: null, status: true };
  const [formData, setFormData] = useState(initialForm);

  axios.defaults.baseURL = 'http://localhost:5000';

  const getAuthHeader = (isMultipart = false) => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    };
  };

  useEffect(() => {
    fetchSliders();
  }, [currentPage, searchTerm]);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/sliders?search=${searchTerm}&page=${currentPage}`,
        getAuthHeader()
      );
      setSliders(res.data.sliders || []);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
      if (isEditMode) {
        await axios.put(`/api/admin/sliders/${selectedId}`, data, getAuthHeader(true));
      } else {
        await axios.post('/api/admin/sliders', data, getAuthHeader(true));
      }
      closeModal();
      fetchSliders();
    } catch (err) {
      alert('Error saving slider');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setFormData(initialForm);
    setImagePreview(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/sliders/${selectedId}`, getAuthHeader());
      setShowDeleteModal(false);
      fetchSliders();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-blue-500 uppercase italic tracking-widest">
          Slider Control
        </h1>
        <div className="flex gap-3">
          <input
            placeholder="Search slider..."
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 px-6 py-2 rounded-xl font-bold"
          >
            + Add Slider
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50 text-[10px] uppercase text-slate-400 font-black">
            <tr>
              <th className="p-5">Slider</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="3" className="p-10 text-center">Loading...</td></tr>
            ) : sliders.map(slider => (
              <tr key={slider._id} className="hover:bg-slate-700/30">
                <td className="p-4 flex items-center gap-4">
                  <img src={slider.image} className="w-24 h-14 rounded-xl object-cover" />
                  <div className="font-bold uppercase">{slider.title}</div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black ${
                    slider.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {slider.status ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="p-4 text-right pr-10 space-x-6">
                  <button
                    onClick={() => {
                      setFormData(slider);
                      setImagePreview(slider.image);
                      setSelectedId(slider._id);
                      setIsEditMode(true);
                      setShowModal(true);
                    }}
                    className="text-blue-400 text-[10px] font-black uppercase"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(slider._id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 text-[10px] font-black uppercase"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 w-full max-w-xl">
            <h2 className="text-xl font-black text-blue-500 mb-6 uppercase italic">
              {isEditMode ? 'Update Slider' : 'Add Slider'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Slider Title"
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl"
                required
              />
              <input type="file" name="image" onChange={handleChange} />
              {imagePreview && (
                <img src={imagePreview} className="w-full h-40 object-cover rounded-2xl" />
              )}
              <button className="w-full bg-blue-600 p-4 rounded-2xl font-black uppercase">
                Save Slider
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-10 rounded-3xl text-center border border-slate-700">
            <h2 className="text-xl font-black text-red-500 mb-6">Delete Slider?</h2>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-700 p-4 rounded-xl">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 p-4 rounded-xl font-black">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Slider;
