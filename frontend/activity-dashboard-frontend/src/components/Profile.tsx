import type React from "react"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { profileAPI } from "../api"

export const Profile = () => {
  const { user, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await profileAPI.update(formData)
      setIsEditing(false)
      setSuccess(true)
      await refreshProfile()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {user.username}
                </h1>
                <p className="text-blue-100 text-base sm:text-lg">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all duration-200 w-full sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl shadow hover:bg-slate-300 transition-all duration-200 w-full sm:w-auto"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                {success && <div className="text-green-600 text-sm mt-2">Profile updated successfully!</div>}
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Username</dt>
                    <dd className="text-xl font-bold text-slate-900">{user.username}</dd>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Email Address</dt>
                    <dd className="text-xl font-bold text-slate-900">{user.email}</dd>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <button
                    className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all duration-200 w-full sm:w-auto"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
