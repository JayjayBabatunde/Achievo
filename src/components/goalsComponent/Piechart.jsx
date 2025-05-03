import PropTypes from 'prop-types';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF4C4C'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChartData = ({ completedGoals, incompleteGoals, deletedGoals }) => {
    const data = [
        { name: 'Completed', value: completedGoals },
        { name: 'Incomplete', value: incompleteGoals },
        { name: 'Deleted', value: deletedGoals },
    ];

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            height: '100%',
            margin: '0 auto',
            padding: '1rem',
        }}>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

PieChartData.propTypes = {
    completedGoals: PropTypes.number.isRequired,
    incompleteGoals: PropTypes.number.isRequired,
    deletedGoals: PropTypes.number.isRequired,
};

export default PieChartData;
