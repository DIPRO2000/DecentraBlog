import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const FullPost = ({ setView }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate=useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/getpostbyid/${postId}`
        );
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message);

        const p = data.post;
        const tagsArray = p.content.tags
          ? p.content.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [];

        setPost({
          id: p.id,
          title: p.title,
          author: p.author,
          timestamp: Number(p.timestamp) * 1000,
          tags: tagsArray,
          content: p.content.content,
          imageUrl: p.content.imageHash
            ? `https://ipfs.io/ipfs/${p.content.imageHash}`
            : null,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading)
    return (
      <p className="text-center text-slate-300 py-20">Loading post…</p>
    );
  if (error)
    return (
      <p className="text-center text-red-400 py-20">
        {error || "Error loading post"}
      </p>
    );
  if (!post) return null;

  return (
    <main className="bg-slate-900 min-h-screen text-slate-200 font-sans">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
        >
          <BackArrowIcon />
          Back to All Posts
        </button>

        <article className="bg-slate-800/60 rounded-2xl border-cyan-400 border-2 shadow-lg p-6 sm:p-8">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-xl mb-6 aspect-video object-cover border-cyan-400 border-2"
            />
          )}

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="text-slate-400 mb-6 border-y border-slate-700 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p>
                By{" "}
                <span className="font-mono bg-slate-700 px-2 py-1 rounded-sm">
                  {post.author}
                </span>
              </p>
              <p className="text-sm mt-2">
                Published on {new Date(post.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-700 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-slate-300 prose-p:leading-relaxed prose-headings:text-slate-100">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
};

export default FullPost;
