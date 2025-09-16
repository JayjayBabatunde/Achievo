import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Target, TrendingUp, Award } from 'lucide-react';
import { ThemeContext } from './ThemeContext';

const AnalyticsDashboard = ({ goals = [] }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const { theme } = useContext(ThemeContext);


    // Calculate monthly success rates when goals change
    useEffect(() => {
        const calculateMonthlyData = () => {
            const monthlyStats = {};
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            // Initialize months from January to current month only
            const currentMonth = currentDate.getMonth(); // 0-11 (0=Jan, 7=Aug)

            for (let month = 0; month <= currentMonth; month++) {
                const date = new Date(currentYear, month, 1);
                const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });

                monthlyStats[monthKey] = {
                    month: monthName,
                    year: currentYear,
                    monthNumber: month + 1,
                    sortKey: month, // Simple 0-11 for Jan-Dec sorting
                    totalGoals: 0,
                    completedGoals: 0,
                    successRate: 0,
                    isCurrentMonth: month === currentDate.getMonth(),
                    isFutureMonth: false // No future months in this approach
                };
            }

            // Filter out deleted goals and process each goal
            const activeGoals = goals.filter(goal => !goal.deleted);
            console.log('Processing goals for deadline-based analytics:', activeGoals);

            activeGoals.forEach(goal => {
                if (!goal.deadline) {
                    console.log('Goal without deadline:', goal);
                    return;
                }

                // Get deadline date (handle both Firebase Timestamp and regular Date)
                let deadline;
                if (goal.deadline?.toDate) {
                    deadline = goal.deadline.toDate();
                } else if (goal.deadline?.seconds) {
                    deadline = new Date(goal.deadline.seconds * 1000);
                } else {
                    deadline = new Date(goal.deadline);
                }

                // Only include goals from the current year
                if (deadline.getFullYear() === currentYear) {
                    const deadlineMonthKey = `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}`;
                    console.log(`Goal "${goal.title}" has deadline in ${deadlineMonthKey}`, deadline);

                    // Count goal in the month of its deadline
                    if (monthlyStats[deadlineMonthKey]) {
                        monthlyStats[deadlineMonthKey].totalGoals += 1;
                        console.log(`Added goal to ${deadlineMonthKey}, total now: ${monthlyStats[deadlineMonthKey].totalGoals}`);

                        // Check if goal is completed
                        if (goal.completed) {
                            monthlyStats[deadlineMonthKey].completedGoals += 1;
                            console.log(`Goal "${goal.title}" completed, added to ${deadlineMonthKey}`);
                        }
                    }
                }
            });

            // Calculate success rates for each month
            Object.values(monthlyStats).forEach(monthData => {
                if (monthData.totalGoals > 0) {
                    monthData.successRate = Math.round((monthData.completedGoals / monthData.totalGoals) * 100);
                } else {
                    monthData.successRate = 0;
                }
                console.log(`${monthData.month}: ${monthData.completedGoals}/${monthData.totalGoals} = ${monthData.successRate}%`);
            });

            // Sort by month number (0-11 for Jan-Dec)
            return Object.values(monthlyStats).sort((a, b) => a.sortKey - b.sortKey);
        };

        setMonthlyData(calculateMonthlyData());
    }, [goals]);

    const currentMonthData = monthlyData.find(data => data.isCurrentMonth) || { successRate: 0, completedGoals: 0, totalGoals: 0 };

    // Calculate statistics (only for months with goals)
    const monthsWithGoals = monthlyData.filter(month => month.totalGoals > 0);
    const averageSuccessRate = monthsWithGoals.length > 0 ? Math.round(
        monthsWithGoals.reduce((sum, month) => sum + month.successRate, 0) / monthsWithGoals.length
    ) : 0;

    const totalCompletedGoals = monthlyData.reduce((sum, month) => sum + month.completedGoals, 0);
    const totalGoals = monthlyData.reduce((sum, month) => sum + month.totalGoals, 0);

    const bestMonth = monthsWithGoals.length > 0 ? monthsWithGoals.reduce((best, current) =>
        current.successRate > best.successRate ? current : best
    ) : { successRate: 0, month: 'N/A' };

    // Theme-based styles
    const cardBg = theme === 'dark' ? 'bg-white/10' : 'bg-gray-0';
    const cardBorder = theme === 'dark' ? 'border-white/20' : 'border-gray-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-gray-600';
    const chartGridColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    const chartAxisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const tooltipBg = theme === 'dark' ? '#1F2937' : '#FFFFFF';
    const tooltipBorder = theme === 'dark' ? '#374151' : '#E5E7EB';
    const tooltipText = theme === 'dark' ? '#F3F4F6' : '#111827';
    const tableBorder = theme === 'dark' ? 'border-white/20' : 'border-gray-200';
    const tableHover = theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100';
    const currentMonthBg = theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100';

    return (
        <div className={`min-h-screen p-3 sm:p-4 lg:p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3 ${textPrimary}`}>
                        Analytics
                    </h1>
                    <p className={`${textSecondary} text-sm sm:text-base lg:text-lg`}>Track your monthly goal completion rates based on deadline dates - showing what percentage of goals due each month were actually completed</p>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border ${cardBorder}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`${textSecondary} text-xs sm:text-sm font-medium`}>Current Month</p>
                                <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{currentMonthData.successRate}%</p>
                                <p className="text-purple-300 text-xs sm:text-sm">{new Date().toLocaleDateString('en-US', { month: 'long' })} Deadline Success</p>
                            </div>
                            <Calendar className="text-purple-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </div>
                    </div>

                    <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border ${cardBorder}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`${textSecondary} text-xs sm:text-sm font-medium`}>Average Rate</p>
                                <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{averageSuccessRate}%</p>
                                <p className="text-green-300 text-xs sm:text-sm">Year-to-Date Average</p>
                            </div>
                            <TrendingUp className="text-green-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </div>
                    </div>

                    <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border ${cardBorder}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`${textSecondary} text-xs sm:text-sm font-medium`}>Best Month</p>
                                <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{bestMonth.successRate}%</p>
                                <p className="text-yellow-300 text-xs sm:text-sm">{bestMonth.month} - Peak Performance</p>
                            </div>
                            <Award className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </div>
                    </div>

                    <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border ${cardBorder}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`${textSecondary} text-xs sm:text-sm font-medium`}>Total Completed</p>
                                <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{totalCompletedGoals}</p>
                                <p className="text-blue-300 text-xs sm:text-sm">Out of {totalGoals} due goals</p>
                            </div>
                            <Target className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                {monthlyData.length > 0 && monthlyData.some(month => month.totalGoals > 0) && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                        {/* Bar Chart */}
                        <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border ${cardBorder}`}>
                            <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 ${textPrimary}`}>Monthly Deadline Success Rates</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                                    <XAxis dataKey="month" stroke={chartAxisColor} fontSize={12} />
                                    <YAxis stroke={chartAxisColor} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: tooltipBg,
                                            border: `1px solid ${tooltipBorder}`,
                                            borderRadius: '8px',
                                            color: tooltipText
                                        }}
                                        formatter={(value) => [`${value}%`, 'Success Rate']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Bar
                                        dataKey="successRate"
                                        fill="url(#barGradient)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#A855F7" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Line Chart */}
                        <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border ${cardBorder}`}>
                            <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 ${textPrimary}`}>Deadline Performance Trend</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                                    <XAxis dataKey="month" stroke={chartAxisColor} fontSize={12} />
                                    <YAxis stroke={chartAxisColor} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: tooltipBg,
                                            border: `1px solid ${tooltipBorder}`,
                                            borderRadius: '8px',
                                            color: tooltipText
                                        }}
                                        formatter={(value) => [`${value}%`, 'Success Rate']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="successRate"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Goals Volume Chart */}
                        <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border ${cardBorder}`}>
                            <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 ${textPrimary}`}>Goals Volume by Deadline</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                                    <XAxis dataKey="month" stroke={chartAxisColor} fontSize={12} />
                                    <YAxis stroke={chartAxisColor} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: tooltipBg,
                                            border: `1px solid ${tooltipBorder}`,
                                            borderRadius: '8px',
                                            color: tooltipText
                                        }}
                                        formatter={(value, name) => [
                                            value,
                                            name === 'completedGoals' ? 'Completed' : 'Total Due'
                                        ]}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Bar
                                        dataKey="totalGoals"
                                        fill="url(#totalGradient)"
                                        radius={[4, 4, 0, 0]}
                                        name="totalGoals"
                                    />
                                    <Bar
                                        dataKey="completedGoals"
                                        fill="url(#completedGradient)"
                                        radius={[4, 4, 0, 0]}
                                        name="completedGoals"
                                    />
                                    <defs>
                                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6B7280" />
                                            <stop offset="100%" stopColor="#9CA3AF" />
                                        </linearGradient>
                                        <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10B981" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Detailed Monthly Breakdown */}
                <div className={`${cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border ${cardBorder}`}>
                    <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-6 ${textPrimary}`}>Detailed Monthly Breakdown (By Deadline)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className={`border-b ${tableBorder}`}>
                                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-medium ${textSecondary} text-xs sm:text-sm`}>Month</th>
                                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-medium ${textSecondary} text-xs sm:text-sm`}>Completed Goals</th>
                                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-medium ${textSecondary} text-xs sm:text-sm`}>Goals Due</th>
                                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-medium ${textSecondary} text-xs sm:text-sm`}>Success Rate</th>
                                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-medium ${textSecondary} text-xs sm:text-sm`}>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyData.length > 0 ? monthlyData.map((month, index) => (
                                    <tr key={index} className={`border-b ${tableBorder} ${month.isCurrentMonth ? currentMonthBg : tableHover}`}>
                                        <td className={`py-2 sm:py-3 px-2 sm:px-4 font-medium ${textPrimary} text-sm`}>
                                            {month.month}
                                            {month.isCurrentMonth && <span className="ml-1 sm:ml-2 text-xs bg-purple-500 text-white px-1 sm:px-2 py-1 rounded-full">Current</span>}
                                        </td>
                                        <td className={`py-2 sm:py-3 px-2 sm:px-4 ${textSecondary} text-sm`}>{month.completedGoals}</td>
                                        <td className={`py-2 sm:py-3 px-2 sm:px-4 ${textSecondary} text-sm`}>{month.totalGoals}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                                            <span className={`font-semibold text-sm ${month.successRate >= 80 ? 'text-green-400' :
                                                month.successRate >= 60 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                {month.successRate}%
                                            </span>
                                        </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${month.totalGoals === 0 ? 'bg-gray-500/20 text-gray-400' :
                                                month.successRate >= 80 ? 'bg-green-500/20 text-green-400' :
                                                    month.successRate >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {month.totalGoals === 0 ? 'No Deadlines' :
                                                    month.successRate >= 80 ? 'Excellent' :
                                                        month.successRate >= 60 ? 'Good' : 'Needs Improvement'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className={`py-6 sm:py-8 text-center ${textSecondary} text-sm`}>
                                            No goals with deadlines found. Create some goals with deadlines to see analytics!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className={`mt-4 sm:mt-6 bg-blue-500/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-500/20`}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 text-blue-300`}>Tip</h3>
                    <p className={`${textSecondary} text-sm sm:text-base`}>
                        Set realistic deadlines for your goals to get meaningful analytics. The dashboard tracks completion rates based on when goals were originally due, helping you identify patterns in your productivity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;