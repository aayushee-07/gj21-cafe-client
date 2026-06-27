import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { Pencil, Trash2, Plus, PackageCheck, PackageX, Check, X } from "lucide-react";

const BASE_URL = "http://localhost:5001";

export default function AdminMenu() {

  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [preview, setPreview] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "", price: "", category: "", description: "", image: null
  });

  const fetchMenu = async () => {
    const res = await api.get(`/menu`);
    setItems(res.data || []);
  };

  useEffect(() => { fetchMenu(); }, []);

  const categories = ["All", ...new Set(items.map(i => i.category))];
  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter(i => i.category === selectedCategory);

  const addItem = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("category", newItem.category);
    formData.append("description", newItem.description);
    formData.append("image", newItem.image);
    try {
      await api.post(`/admin/menu`, formData);
      setNewItem({ name: "", price: "", category: "", description: "", image: null });
      setPreview(null);
      fetchMenu();
    } catch (error) {
      console.error("Add error:", error.response?.data || error.message);
    }
  };

  const deleteItem = async () => {
    try {
      await api.delete(`/admin/menu/${deleteId}`);
      setDeleteModal(false);
      setDeleteId(null);
      fetchMenu();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  const toggleStock = async (id) => {
    try {
      await api.put(`/admin/menu/${id}/toggle`);
      fetchMenu();
    } catch (error) {
      console.error("Toggle error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditedItem({ ...item, preview: `${BASE_URL}${item.image}` });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("name", editedItem.name);
    formData.append("price", editedItem.price);
    formData.append("category", editedItem.category);
    formData.append("description", editedItem.description);
    if (editedItem.image instanceof File) {
      formData.append("image", editedItem.image);
    }
    try {
      await api.put(`/admin/menu/${editingId}`, formData);
      setEditingId(null);
      fetchMenu();
    } catch (error) {
      console.error("Edit error:", error.response?.data || error.message);
    }
  };

  /* ═══════════════════════════════════════════
      PAGE 1 — ADD ITEM FORM
  ═══════════════════════════════════════════ */
  if (!showMenu) {
    return (
      <div className="min-h-screen flex items-start justify-center pt-8">
        <div className="w-full max-w-xl">

        <div className="mb-5">
          <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
            ➕ Add New Item
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Fill in the details to add a new item to your menu.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7">
          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Item Name <span className="text-[#c89b3c]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kit-Kat Cold Coffee"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                text-stone-800 placeholder:text-stone-300 focus:outline-none
                focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 tracking-wide">
                  Price (₹) <span className="text-[#c89b3c]">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                  text-stone-800 placeholder:text-stone-300 focus:outline-none
                  focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 tracking-wide">
                  Category <span className="text-[#c89b3c]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. coldcoffee"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                  text-stone-800 placeholder:text-stone-300 focus:outline-none
                  focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Description
              </label>
              <textarea
                placeholder="e.g. Creamy cold coffee topped with crunchy Kit-Kat."
                value={newItem.description}
                rows={3}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                text-stone-800 placeholder:text-stone-300 resize-none focus:outline-none
                focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Item Image <span className="text-[#c89b3c]">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center gap-3 border-2 border-dashed
                  border-stone-200 bg-stone-50 hover:border-[#c89b3c] hover:bg-amber-50
                  px-4 py-3.5 rounded-xl cursor-pointer transition-all">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center">
                    <Plus size={16} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-500 truncate max-w-[200px]">
                      {newItem.image ? newItem.image.name : "Click to upload image"}
                    </p>
                    <p className="text-[11px] text-stone-300 mt-0.5">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setNewItem({ ...newItem, image: file });
                      setPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {preview && (
                  <img src={preview} alt="preview"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-stone-200 flex-shrink-0" />
                )}
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-7 pt-6 border-t border-stone-100">
            <button
              onClick={addItem}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
              px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-green-200
              hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Plus size={16} /> Add Item
            </button>
            <button
              onClick={() => setShowMenu(true)}
              className="flex items-center gap-2 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
              px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-amber-200
              hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Menu Management →
            </button>
          </div>

        </div>

        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
      PAGE 2 — MENU MANAGEMENT
  ═══════════════════════════════════════════ */
  return (
    <div className="min-h-screen">

      {/* Heading + Add Item button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
            🍽️ Menu Management
          </h1>
          <p className="text-stone-400 text-sm mt-1">{items.length} total items</p>
        </div>
        <button
          onClick={() => setShowMenu(false)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
          px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-green-200
          hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all
              ${selectedCategory === cat
                ? "bg-[#c89b3c] text-white shadow-sm shadow-amber-200"
                : "bg-white border border-stone-200 text-stone-500 hover:border-[#c89b3c] hover:text-[#c89b3c]"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-stone-400 font-medium mb-5">
        Showing <span className="text-stone-600 font-semibold">{filteredItems.length}</span> items
        {selectedCategory !== "All" && (
          <span> in <span className="text-[#c89b3c] font-semibold capitalize">{selectedCategory}</span></span>
        )}
      </p>

      {/* GRID — matches menu.jsx */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredItems.map(item => {
          const editing = editingId === item._id;
          return (
            <article
              key={item._id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300
              flex flex-col overflow-hidden group"
            >

              <div className="relative aspect-square overflow-hidden">
                <img
                  src={editing && editedItem.preview ? editedItem.preview : `${BASE_URL}${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${item.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  {item.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-grow">

                {editing ? (
                  <div className="flex flex-col gap-2">
                    {[["Name","text","name"],["Category","text","category"],["Price","number","price"]].map(([label,type,key]) => (
                      <input key={key} type={type} placeholder={label}
                        value={editedItem[key]}
                        onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
                        className="border border-stone-200 bg-stone-50 px-2.5 py-1.5 rounded-lg
                        text-xs text-stone-800 focus:outline-none focus:ring-2
                        focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all w-full"
                      />
                    ))}
                    <textarea placeholder="Description" rows={2}
                      value={editedItem.description}
                      onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                      className="border border-stone-200 bg-stone-50 px-2.5 py-1.5 rounded-lg
                      text-xs text-stone-800 resize-none focus:outline-none focus:ring-2
                      focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all w-full"
                    />
                    <label className="flex items-center gap-1.5 border border-dashed border-stone-300
                      bg-stone-50 px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-[#c89b3c]
                      transition-all text-xs text-stone-400">
                      <Plus size={11} /> Change image
                      <input type="file" className="hidden"
                        onChange={(e) => setEditedItem({ ...editedItem, image: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) })}
                      />
                    </label>
                    <div className="flex gap-2 mt-1">
                      <button onClick={saveEdit}
                        className="flex-1 py-1.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white text-xs
                        font-semibold rounded-xl transition-all flex items-center justify-center gap-1">
                        <Check size={11} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs
                        font-semibold rounded-xl transition-all flex items-center justify-center gap-1">
                        <X size={11} /> Cancel
                      </button>
                    </div>
                  </div>

                ) : (
                  <>
                    <p className="text-xs font-semibold text-[#c89b3c] tracking-wide mb-1 capitalize">
                      {item.category}
                    </p>
                    <h3 className="text-[14px] font-semibold text-stone-800 mb-1 leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-stone-400 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
                      {item.description || "Delicious item from our menu."}
                    </p>

                    <div className="mt-auto pt-2 border-t border-stone-100">
                      <span className="text-[#c89b3c] font-bold text-base block mb-2.5">
                        ₹{item.price}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => startEdit(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50
                          border border-amber-200 text-[#c89b3c] text-[11px] font-semibold
                          rounded-lg hover:bg-amber-100 transition-all">
                          <Pencil size={10} /> Edit
                        </button>
                        <button onClick={() => { setDeleteId(item._id); setDeleteModal(true); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50
                          border border-red-200 text-red-500 text-[11px] font-semibold
                          rounded-lg hover:bg-red-100 transition-all">
                          <Trash2 size={10} /> Delete
                        </button>
                        <button onClick={() => toggleStock(item._id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px]
                          font-semibold rounded-lg border transition-all
                          ${item.isAvailable
                            ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                            : "bg-stone-100 border-stone-200 text-stone-500 hover:bg-stone-200"
                          }`}>
                          {item.isAvailable ? <><PackageCheck size={10} /> In</> : <><PackageX size={10} /> Out</>}
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </article>
          );
        })}
      </div>

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-sm p-7">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-stone-800 text-center mb-1">Delete Item</h2>
            <p className="text-sm text-stone-400 text-center mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { setDeleteModal(false); setDeleteId(null); }}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-500
                text-sm font-semibold hover:bg-stone-100 transition-all">
                Cancel
              </button>
              <button onClick={deleteItem}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white
                rounded-xl text-sm font-semibold shadow-md shadow-red-200 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}