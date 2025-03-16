interface StatsCardProps {
    title: string;
    value: number;
}

export const StatsCard = ({ title, value }: StatsCardProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}; 