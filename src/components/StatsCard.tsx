
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
}

const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
  const colorClasses = {
    blue: 'from-delivery-blue-500 to-delivery-blue-600 text-delivery-blue-50',
    green: 'from-delivery-green-500 to-delivery-green-600 text-delivery-green-50',
    orange: 'from-delivery-orange-500 to-delivery-orange-600 text-delivery-orange-50',
    red: 'from-red-500 to-red-600 text-red-50'
  };

  const bgClasses = {
    blue: 'bg-delivery-blue-50',
    green: 'bg-delivery-green-50',
    orange: 'bg-delivery-orange-50',
    red: 'bg-red-50'
  };

  return (
    <Card className="delivery-card overflow-hidden">
      <CardContent className="p-0">
        <div className={`${bgClasses[color]} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
