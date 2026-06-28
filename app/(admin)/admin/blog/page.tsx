"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  coverEmoji: string;
  createdAt: string;
};

const empty = {
  title: "",
  excerpt: "",
  content: "",
  category: "News",
  published: false,
  coverEmoji: "📝",
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          setPosts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function fetchData() {
    const data = await fetch("/api/blog").then((r) => r.json());
    setPosts(Array.isArray(data) ? data : []);
  }

  async function handleSubmit() {
    if (!form.title || !form.content)
      return alert("Title and content required");
    setSaving(true);
    if (editing) {
      await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    } else {
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setShowModal(false);
    setEditing(null);
    setForm(empty);
    fetchData();
  }

  function openEdit(p: Post) {
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      published: p.published,
      coverEmoji: p.coverEmoji,
    });
    setEditing(p.id);
    setShowModal(true);
  }

  async function togglePublish(p: Post) {
    await fetch("/api/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, published: !p.published }),
    });
    fetchData();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog / News</h1>
          <p className="text-gray-500 text-sm mt-1">
            {posts.filter((p) => p.published).length} published · {posts.length}{" "}
            total
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setForm(empty);
            setEditing(null);
            setShowModal(true);
          }}
        >
          + New Post
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-gray-400 text-sm p-4">Loading...</p>}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <div className="text-3xl mb-2">📝</div>
            <div>No blog posts yet — write your first one!</div>
          </div>
        )}
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#f8fafc",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {p.coverEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {p.title}
                </span>
                <span className={p.published ? "badge-green" : "badge-gray"}>
                  {p.published ? "Published" : "Draft"}
                </span>
                <span className="badge-blue">{p.category}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{p.excerpt}</p>
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(p.createdAt), "dd MMM yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => togglePublish(p)}
                className={`text-xs font-medium px-3 py-1 rounded-lg ${p.published ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}`}
              >
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => openEdit(p)}
                className="text-blue-600 text-xs font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-500 text-xs font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Post" : "New Blog Post"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="form-label">Emoji</label>
                  <input
                    className="form-input text-center text-xl"
                    value={form.coverEmoji}
                    onChange={(e) =>
                      setForm({ ...form, coverEmoji: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-3">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    placeholder="Post title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option>News</option>
                    <option>Update</option>
                    <option>Tutorial</option>
                    <option>Case Study</option>
                    <option>Announcement</option>
                  </select>
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  <input
                    type="checkbox"
                    id="pub"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                    className="w-4 h-4 accent-blue-600"
                  />
                  <label
                    htmlFor="pub"
                    className="text-sm text-gray-700 font-medium"
                  >
                    Publish immediately
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">Excerpt (shown in preview)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Short summary of the post..."
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Content *</label>
                <textarea
                  className="form-input"
                  rows={10}
                  placeholder="Write your full blog post here..."
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? "Update Post" : "Create Post"}
              </button>
              <button
                className="btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
