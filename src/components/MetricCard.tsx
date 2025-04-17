
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cva } from 'class-variance-authority';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'highlight' | 'neutral';
}

const cardVariants = cva(
  "overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md", 
  {
    variants: {
      variant: {
        default: "border-gray-100 hover:border-funillab-blue/20",
        highlight: "border-l-4 border-l-funillab-cyan border-gray-100",
        neutral: "border-gray-100 bg-gray-50",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

const iconVariants = cva(
  "p-2 rounded-md flex items-center justify-center", 
  {
    variants: {
      variant: {
        default: "bg-funillab-blue/10 text-funillab-blue",
        highlight: "bg-funillab-cyan/10 text-funillab-cyan",
        neutral: "bg-gray-100 text-gray-500",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
  variant = 'default',
}) => {
  return (
    <Card className={`${cardVariants({ variant })} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={iconVariants({ variant })}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-funillab-blue">{
          typeof value === 'number' ? value.toLocaleString() : value
        }</div>
        {trend && (
          <p className={`text-xs flex items-center mt-1 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1 text-lg">
              {trend.isPositive ? '↑' : '↓'}
            </span>
            {trend.value}%{' '}
            <span className="text-gray-500 ml-1 font-normal">vs. período anterior</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
