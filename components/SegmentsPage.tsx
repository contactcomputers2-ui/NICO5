
import React from 'react';
import ContactsIcon from './icons/ContactsIcon';
import SparklesIcon from './icons/SparklesIcon';

interface SegmentsPageProps {
    setNavigationView: (view: string, payload: any) => void;
}

const SegmentCard: React.FC<{
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
}> = ({ title, description, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </button>
);

const SegmentsPage: React.FC<SegmentsPageProps> = ({ setNavigationView }) => {
    const segments = [
        {
            title: 'All Contacts',
            description: 'View every contact in your CRM.',
            icon: ContactsIcon,
            filter: null,
        },
        {
            title: 'VIP Customers',
            description: 'Contacts tagged as "vip".',
            icon: SparklesIcon,
            filter: { tag: 'vip' },
        },
        {
            title: 'New Leads',
            description: 'Contacts tagged as "lead".',
            icon: SparklesIcon,
            filter: { tag: 'lead' },
        },
        {
            title: 'General Customers',
            description: 'Contacts tagged as "customer".',
            icon: SparklesIcon,
            filter: { tag: 'customer' },
        },
    ];

    const handleSegmentClick = (filter: { tag: string } | null) => {
        setNavigationView('Contacts', { filter });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Segments</h1>
                <p className="mt-1 text-sm text-gray-500">View dynamic, pre-filtered lists of your contacts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {segments.map(segment => (
                    <SegmentCard
                        key={segment.title}
                        title={segment.title}
                        description={segment.description}
                        icon={segment.icon}
                        onClick={() => handleSegmentClick(segment.filter)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SegmentsPage;