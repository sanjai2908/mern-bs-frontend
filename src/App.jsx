import React, { useEffect, useState } from "react";
import api from "./api/client";
import BookForm from "./components/BookForm";
import BookTable from "./components/BookTable";
import ConfirmDialog from "./components/ConfirmDialog";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, book: null });
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBooks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/books");
      setBooks(data.data || []);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const createBook = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/books", payload);
      setBooks((prev) => [data.data, ...prev]);
      showToast("success", "Book added successfully");
    } catch (err) {
      showToast("error", err.data?.errors?.[0]?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (payload) => {
    if (!editing) return;
    setLoading(true);
    try {
      const { data } = await api.put(`/books/${editing._id}`, payload);
      setBooks((prev) =>
        prev.map((b) => (b._id === editing._id ? data.data : b))
      );
      setEditing(null);
      showToast("success", "Book updated");
    } catch (err) {
      showToast("error", err.data?.errors?.[0]?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async () => {
    const book = confirm.book;
    if (!book) return;
    setLoading(true);
    try {
      await api.delete(`/books/${book._id}`);
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      showToast("success", "Book deleted");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
      setConfirm({ open: false, book: null });
    }
  };

  return (
    <div className="container">
      <header className="row space-between center">
        <h2>MERN Bookstore</h2>
        <span className="muted">
          Backend: {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
        </span>
      </header>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {!editing ? (
        <BookForm onSubmit={createBook} loading={loading} />
      ) : (
        <BookForm
          initialData={editing}
          onSubmit={updateBook}
          onCancel={() => setEditing(null)}
          loading={loading}
        />
      )}

      <BookTable
        items={books}
        loading={loading}
        onEdit={(b) => setEditing(b)}
        onDelete={(b) => setConfirm({ open: true, book: b })}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete book?"
        message={
          confirm.book
            ? `Are you sure you want to delete "${confirm.book.title}"?`
            : ""
        }
        onCancel={() => setConfirm({ open: false, book: null })}
        onConfirm={deleteBook}
      />

      <footer className="muted center" style={{ marginTop: 24 }}>
        Built with React + Express + MongoDB
      </footer>
    </div>
  );
}
