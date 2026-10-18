import React from 'react';
import { ListingStatus } from '../../types';
import { getStatusBadgeInfo } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ListingStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { language } = useLanguage();
  const info = getStatusBadgeInfo(status, language);

  const getIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
      case 'pending':
        return <Clock className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
      case 'rejected':
        return <XCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
      default:
        return null;
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${info.bgClass} ${info.textClass} ${info.borderClass} ${sizeClasses}`}
    >
      {getIcon()}
      <span>{info.label}</span>
    </span>
  );
};
