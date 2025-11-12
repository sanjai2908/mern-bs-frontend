import React from "react";

export default function BookTable({ items, onEdit, onDelete, loading }) {
  return (
    <div className="card">
      <div className="row space-between">
        <h3>Books ({items.length})</h3>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Year</th>
              <th>Stock</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.genre || "—"}</td>
                <td>₹{Number(b.price).toFixed(2)}</td>
                <td>{b.publishedYear || "—"}</td>
                <td>{b.inStock ? "Yes" : "No"}</td>
                <td>
                  <div className="row gap">
                    <button className="btn small" onClick={() => onEdit(b)}>
                      Edit
                    </button>
                    <button
                      className="btn small danger"
                      onClick={() => onDelete(b)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="muted">
                  {loading ? "Loading…" : "No books yet. Add one!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
