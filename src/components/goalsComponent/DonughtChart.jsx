import PropTypes from 'prop-types';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Updated color scheme
const COLORS = ['#4CAF50', '#FFC107', '#F44336']; // green, yellow, red

const DonughtChart = ({ completedGoals, incompleteGoals, deletedGoals }) => {
    const data = [
        { name: 'Completed', value: completedGoals },
        { name: 'Incomplete', value: incompleteGoals },
        { name: 'Deleted', value: deletedGoals },
    ];


    const getRadius = () => {
        if (window.innerWidth < 768) {
            return { outerRadius: 120, innerRadius: 60 };
        }
        return { outerRadius: 160, innerRadius: 70 };
    };

    const { outerRadius, innerRadius } = getRadius();

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
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
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

DonughtChart.propTypes = {
    completedGoals: PropTypes.number.isRequired,
    incompleteGoals: PropTypes.number.isRequired,
    deletedGoals: PropTypes.number.isRequired,
};

export default DonughtChart;
