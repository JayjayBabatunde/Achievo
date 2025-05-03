import PropTypes from 'prop-types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

const VerticalBarChart = ({ completedGoals, incompleteGoals, deletedGoals }) => {
    const data = [
        { name: 'Completed', value: completedGoals },
        { name: 'Incomplete', value: incompleteGoals },
        { name: 'Deleted', value: deletedGoals },
    ];

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            height: '500px',
            margin: '0 auto',
            padding: '1rem',
            paddingBottom: '6rem'
        }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    barCategoryGap={30}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className='grid sm:grid-cols-3 mx-auto grid-cols-2 p-1 w-full items-center sm:gap-10 gap-2 justify-center mt-6'>
                <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 bg-[#4CAF50]'></span>
                    <span className='text-[#4CAF50]'>Completed</span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 bg-[#FFC107]'></span>
                    <span className='text-[#FFC107]'>Incomplete</span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 bg-[#F44336]'></span>
                    <span className='text-[#F44336]'>Deleted</span>
                </div>
            </div>
        </div>
    );
};

VerticalBarChart.propTypes = {
    completedGoals: PropTypes.number.isRequired,
    incompleteGoals: PropTypes.number.isRequired,
    deletedGoals: PropTypes.number.isRequired,
};

export default VerticalBarChart;
