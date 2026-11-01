import React from 'react';
import {
  Compass,
  Sparkles,
  Zap,
  Users,
  Sun,
  Radio,
  Wand2,
  MessageSquareQuote,
  Crown,
  ShieldCheck,
  Lightbulb,
  Eye,
  Rocket,
  Timer,
  Hammer,
  Magnet,
  Search,
  Flame,
  GraduationCap,
  Hourglass,
  Layers,
  HeartHandshake,
  Shield,
  Sparkle,
  Laugh,
  Coffee,
  Palette,
  Wind,
  HelpCircle,
  Star
} from 'lucide-react';

interface SuperpowerIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const SuperpowerIcon: React.FC<SuperpowerIconProps> = ({
  name,
  className = 'w-6 h-6',
  size
}) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'Radio':
      return <Radio {...iconProps} />;
    case 'Wand2':
      return <Wand2 {...iconProps} />;
    case 'MessageSquareQuote':
      return <MessageSquareQuote {...iconProps} />;
    case 'Crown':
      return <Crown {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'Lightbulb':
      return <Lightbulb {...iconProps} />;
    case 'Eye':
      return <Eye {...iconProps} />;
    case 'Rocket':
      return <Rocket {...iconProps} />;
    case 'Timer':
      return <Timer {...iconProps} />;
    case 'Hammer':
      return <Hammer {...iconProps} />;
    case 'Magnet':
      return <Magnet {...iconProps} />;
    case 'Search':
      return <Search {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'Hourglass':
      return <Hourglass {...iconProps} />;
    case 'Layers':
      return <Layers {...iconProps} />;
    case 'HeartHandshake':
      return <HeartHandshake {...iconProps} />;
    case 'Shield':
      return <Shield {...iconProps} />;
    case 'Sparkle':
      return <Sparkle {...iconProps} />;
    case 'Laugh':
      return <Laugh {...iconProps} />;
    case 'Coffee':
      return <Coffee {...iconProps} />;
    case 'Palette':
      return <Palette {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'HelpCircle':
      return <HelpCircle {...iconProps} />;
    case 'Star':
      return <Star {...iconProps} />;
    default:
      return <Wind {...iconProps} />;
  }
};
