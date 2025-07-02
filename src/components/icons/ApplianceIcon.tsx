import { Tv, Wind, Lightbulb, Laptop, Refrigerator, Package, Zap, Snowflake, IconProps } from 'lucide-react';
import React from 'react';

interface ApplianceIconProps extends IconProps {
  name: string;
}

const iconMap: { [key: string]: React.ElementType<IconProps> } = {
  'tv': Tv,
  'fan': Wind,
  'bulb': Lightbulb,
  'laptop': Laptop,
  'fridge': Refrigerator,
  'freezer': Snowflake,
  'other': Package,
  'default': Zap
};

const ApplianceIcon: React.FC<ApplianceIconProps> = ({ name, ...props }) => {
  const normalizedName = name.toLowerCase();
  const IconComponent = iconMap[normalizedName] || iconMap['default'];
  return <IconComponent {...props} />;
};

export default ApplianceIcon;
