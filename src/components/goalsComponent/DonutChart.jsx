import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';

const DonutChart = ({ data, }) => {
    const getColor = (value) => {
        if (value > 5) return 'hsl(210, 100%, 50%)'; // Blue
        if (value > 3) return 'hsl(30, 100%, 75%)';  // oragne
        return 'hsl(0, 100%, 50%)';                   // Red
    };

    const coloredData = data.map(item => ({
        ...item,
        color: getColor(item.value),
    }));

    return (
        <div className='' style={{ height: '100%' }}>
            <div style={{ height: '500px', width: '550px' }}>
                <ResponsivePie
                    data={coloredData}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    enableArcLabels={true}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    margin={{ top: 20, right: 110, bottom: 80, left: 110 }}
                    colors={{ datum: 'data.color' }}
                />
            </div>

            <div className='flex items-center justify-center gap-16'>
                <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-sm' style={{ background: 'hsl(210, 100%, 50%)' }}></div>
                    <span className='text-[14px]' style={{ color: 'hsl(210, 100%, 50%)' }}>Completed</span>
                </div>

                <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-sm' style={{ background: 'hsl(30, 100%, 75%)' }}></div>
                    <span className='text-[14px]' style={{ color: 'hsl(30, 100%, 75%)' }}>Incomplete</span>
                </div>

                <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-sm' style={{ background: 'hsl(0, 100%, 50%)' }}></div>
                    <span className='text-[14px]' style={{ color: 'hsl(0, 100%, 50%)' }}>Deleted</span>
                </div>
            </div>
        </div>
    );
};

DonutChart.propTypes = {
    data: PropTypes.array.isRequired,
}

export default DonutChart;