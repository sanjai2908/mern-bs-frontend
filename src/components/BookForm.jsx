import React, { useEffect, useState } from "react";

const initial = {
  title: "",
  author: "",
  genre: "",
  price: "",
  description: "",
  publishedYear: "",
  inStock: true,
};

export default function BookForm({ onSubmit, loading, initialData, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initial,
        ...initialData,
        price: initialData.price ?? "",
        publishedYear: initialData.publishedYear ?? "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.title || form.title.trim().length < 2)
      e.title = "Title (min 2 chars) required";
    if (!form.author) e.author = "Author required";
    if (
      form.price === "" ||
      Number(form.price) < 0 ||
      isNaN(Number(form.price))
    )
      e.price = "Valid non-negative price required";
    if (
      form.publishedYear &&
      (Number(form.publishedYear) < 0 || Number(form.publishedYear) > 3000)
    )
      e.publishedYear = "Year must be between 0–3000";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      price: Number(form.price),
      publishedYear: form.publishedYear
        ? Number(form.publishedYear)
        : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h3>{initialData ? "Edit Book" : "Add New Book"}</h3>

      <div className="grid-2">
        <label>
          <span>Title *</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <small className="error">{errors.title}</small>}
        </label>

        <label>
          <span>Author *</span>
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          {errors.author && <small className="error">{errors.author}</small>}
        </label>

        <label>
          <span>Genre</span>
          <input
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />
        </label>

        <label>
          <span>Price (₹) *</span>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          {errors.price && <small className="error">{errors.price}</small>}
        </label>

        <label>
          <span>Published Year</span>
          <input
            type="number"
            value={form.publishedYear}
            onChange={(e) =>
              setForm({ ...form, publishedYear: e.target.value })
            }
          />
          {errors.publishedYear && (
            <small className="error">{errors.publishedYear}</small>
          )}
        </label>

        <label className="row">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
          />
          <span>In Stock</span>
        </label>
      </div>

      <label>
        <span>Description</span>
        <textarea
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      <div className="row gap">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving…" : initialData ? "Update" : "Add Book"}
        </button>
        {initialData && (
          <button className="btn outline" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
