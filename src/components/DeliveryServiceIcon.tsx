import React from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';

interface DeliveryServiceIconProps {
  service: string;
  className?: string;
}

const DeliveryServiceIcon: React.FC<DeliveryServiceIconProps> = ({ service, className = "h-5 w-5" }) => {
  const getIconColor = (service: string) => {
    switch (service.toLowerCase()) {
      case 'ups':
        return 'text-[#351C15]'; // UPS Brown
      case 'usps':
        return 'text-[#004B87]'; // USPS Blue
      case 'fedex':
        return 'text-[#4D148C]'; // FedEx Purple
      case 'amazon':
        return 'text-[#FF9900]'; // Amazon Orange
      case 'dhl':
        return 'text-[#FFCC00]'; // DHL Yellow
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 ${getIconColor(service)}`}>
      <TruckIcon className={className} />
      <span className="text-sm font-medium">{service.toUpperCase()}</span>
    </div>
  );
};

export default DeliveryServiceIcon; 