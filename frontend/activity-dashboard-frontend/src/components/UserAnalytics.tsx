import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"
import { activityAPI } from "../api"
import type { LoginLogoutData } from "../api"
import { useAuth } from "../hooks/useAuth"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

export const UserAnalytics = () => {
  const [data, setData] = useState<LoginLogoutData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<"bar" | "line" | "doughnut">("bar")
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await activityAPI.getChart()
        setData(response.data)
      } catch (err) {
        const error = err as { response?: { data?: { detail?: string } } }
        setError(error.response?.data?.detail || "Failed to load analytics data")
        // Do not set any mock data here
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!user?.is_superuser) {
    return <div>You do not have permission to view this page.</div>
  }

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-24 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && data.length === 0) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Data</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Process data for charts
  const days = [...new Set(data.map(item => item.day))]
  const loginData = days.map(day => data.find(item => item.day === day && item.activity_type === "login")?.count || 0)
  const logoutData = days.map(day => data.find(item => item.day === day && item.activity_type === "logout")?.count || 0)

  const totalLogins = loginData.reduce((sum, count) => sum + count, 0)
  const totalLogouts = logoutData.reduce((sum, count) => sum + count, 0)
  const averageLogins = Math.round(totalLogins / days.length)
  const averageLogouts = Math.round(totalLogouts / days.length)

  // Chart configurations
  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Logins",
        data: loginData,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: "Logouts",
        data: logoutData,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }


  const doughnutData = {
    labels: ["Total Logins", "Total Logouts"],
    datasets: [
      {
        data: [totalLogins, totalLogouts],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#64748b",
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#64748b",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
        },
      },
    },
  }


  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#64748b",
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context: { label: string; parsed: number; dataset: { data: number[] } }) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} (${percentage}%)`
          },
        },
      },
    },
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={chartOptions} height={400} />
      case "doughnut":
        return <Doughnut data={doughnutData} options={doughnutOptions} height={400} />
      default:
        return <Bar data={chartData} options={chartOptions} height={400} />
    }
  }

  return (
    <div className="py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">User Analytics</h1>
          <p className="text-lg sm:text-xl text-slate-600">Track login/logout patterns and user engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Logins</p>
                <p className="text-2xl font-bold text-slate-900">{totalLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Logouts</p>
                <p className="text-2xl font-bold text-slate-900">{totalLogouts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Avg Logins/Day</p>
                <p className="text-2xl font-bold text-slate-900">{averageLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Avg Logouts/Day</p>
                <p className="text-2xl font-bold text-slate-900">{averageLogouts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-4 sm:p-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Login/Logout Analytics</h3>
              <p className="text-slate-600">Weekly patterns of user sessions</p>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  chartType === "bar"
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setChartType("doughnut")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  chartType === "doughnut"
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Doughnut
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Chart */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8 rounded-2xl">
              <div className="h-72 sm:h-96">{renderChart()}</div>
            </div>

            {/* Data Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Daily Breakdown</h4>
                <div className="space-y-3">
                  {days.map((day, index) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="font-medium text-slate-700">{day}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-slate-600">Login: {loginData[index]}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-slate-600">Logout: {logoutData[index]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Session Insights</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <span className="font-semibold text-blue-800">Most Active Day</span>
                    </div>
                    <p className="text-blue-700">
                      {days[loginData.indexOf(Math.max(...loginData))]} with {Math.max(...loginData)} logins
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <span className="font-semibold text-emerald-800">Session Completion</span>
                    </div>
                    <p className="text-emerald-700">
                      {Math.round((totalLogouts / totalLogins) * 100)}% of sessions properly closed
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-semibold text-purple-800">Weekly Total</span>
                    </div>
                    <p className="text-purple-700">{totalLogins + totalLogouts} total session events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 