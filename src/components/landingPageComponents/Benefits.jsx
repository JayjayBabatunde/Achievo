import { Rocket } from "lucide-react";
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Benefits = () => {
    const benefits = [
        {
            title: 'Benefit 1',
            description: 'Clearly state a key advantage of your product',
        },
        {
            title: 'Benefit 2',
            description: 'Another important benefit that sets you apart.',
        },
        {
            title: 'Benefit 3',
            description: 'Address a specific pain point your product solves.',
        },
        {
            title: 'Benefit 4',
            description: 'Highlight a unique feature or outcome.',
        },
    ];

    useEffect(() => {
        AOS.init({ duration: 1000, once: true }); // Initialize AOS with options
    }, []);

    return (
        <section className="py-12 px-6">
            <div className="text-center">
                <h2 className="text-4xl font-bold mb-3">Why Use Achievo</h2>
                <p className="text-gray-600 mb-8">
                    Iterative approaches corporate strategy collaborative thinking
                    further the overall value proposition <br />organically grows holistic world
                    views of disruptive innovation work place diversity and empowerment.
                </p>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 py-6">
                {benefits.map((benefit, index) => (
                    <div key={index} className="bg-[#0061ff] hover:bg-white hover:text-[#0061ff] text-white shadow-lg rounded-lg p-6 mb-6 w-80 py-14 transition-all duration-150 cursor-pointer">
                        <div className="flex items-center justify-start mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Rocket className="text-[#0061ff]" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                        <p className="mb-4">{benefit.description}</p>
                        <a
                            href="#"
                            className="hover:underline"
                        >
                            Learn more &gt;
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Benefits;
