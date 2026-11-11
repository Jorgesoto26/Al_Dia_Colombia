/**
 * Iconos Vectoriales Nativos SVG
 * Al Día Colombia
 */
import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { COLORS } from '../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
}

export const CarIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 11L7.5 5.5C7.8 4.6 8.7 4 9.7 4H14.3C15.3 4 16.2 4.6 16.5 5.5L19 11M5 11H19M5 11C3.9 11 3 11.9 3 13V17C3 17.6 3.4 18 4 18H5M19 11C20.1 11 21 11.9 21 13V17C21 17.6 20.6 18 20 18H19M7 18C7 19.1 6.1 20 5 20C3.9 20 3 19.1 3 18M17 18C17 19.1 17.9 20 19 20C20.1 20 21 19.1 21 18M6.5 14H7.5M16.5 14H17.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MotoIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="5" cy="16" r="3" stroke={color} strokeWidth="1.8" />
    <Circle cx="19" cy="16" r="3" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 16H8L11 9L15 9L18 16M13 6H16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TaxiIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="8" y="2" width="8" height="3" rx="1" stroke={color} strokeWidth="1.6" />
    <Path
      d="M5 12L7.5 6.5C7.8 5.6 8.7 5 9.7 5H14.3C15.3 5 16.2 5.6 16.5 6.5L19 12M5 12H19M5 12C3.9 12 3 12.9 3 14V17C3 17.6 3.4 18 4 18H5M19 12C20.1 12 21 12.9 21 14V17C21 17.6 20.6 18 20 18H19M7 18C7 19.1 6.1 20 5 20C3.9 20 3 19.1 3 18M17 18C17 19.1 17.9 20 19 20C20.1 20 21 19.1 21 18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
    <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const DollarIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 7V17M14.5 9.5C14.5 8.4 13.4 7.5 12 7.5C10.6 7.5 9.5 8.4 9.5 9.5C9.5 12 14.5 11 14.5 13.5C14.5 14.6 13.4 15.5 12 15.5C10.6 15.5 9.5 14.6 9.5 13.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C16 16.5 19 13.2 19 9.5C19 5.6 15.9 2.5 12 2.5C8.1 2.5 5 5.6 5 9.5C5 13.2 8 16.5 12 21Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9.5" r="2.5" stroke={color} strokeWidth="1.8" />
  </Svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4 17.4 4.9 16.2 3.8C15.1 2.6 13.6 2 12 2C10.4 2 8.9 2.6 7.8 3.8C6.6 4.9 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M13.7 21C13.5 21.3 13.3 21.6 13 21.7C12.7 21.9 12.3 22 12 22C11.7 22 11.3 21.9 11 21.7C10.7 21.6 10.5 21.3 10.3 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.5 2V7H16.5M2.5 22V17H7.5M20.5 13C20 17 16.5 20.3 12 20.3C7.6 20.3 3.9 17.3 3.2 13M3.5 11C4 7 7.5 3.7 12 3.7C16.4 3.7 20.1 6.7 20.8 11"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.danger }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21M19 6L18.3 19.1C18.2 20.2 17.3 21 16.2 21H7.8C6.7 21 5.8 20.2 5.7 19.1L5 6M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M10 11V16M14 11V16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 20,
  color = COLORS.accent,
  filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M12 2L15.1 8.3L22 9.2L17 14.1L18.2 21L12 17.8L5.8 21L7 14.1L2 9.2L8.9 8.3L12 2Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.accent }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.3 3.8L1.6 18.9C1.2 19.6 1.7 20.5 2.5 20.5H21.5C22.3 20.5 22.8 19.6 22.4 18.9L13.7 3.8C13.3 3.1 12.3 3.1 11.9 3.8L10.3 3.8ZM12 9V13M12 17H12.01"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <Path
      d="M19.4 15A1.7 1.7 0 0 0 20.5 17.2L20.8 17.7A2 2 0 0 1 18.7 20.7L18.1 20.5A1.7 1.7 0 0 0 16 21.6V22A2 2 0 0 1 12 22V21.6A1.7 1.7 0 0 0 9.9 20.5L9.3 20.7A2 2 0 0 1 7.2 17.7L7.5 17.2A1.7 1.7 0 0 0 6.4 15H6A2 2 0 0 1 6 11H6.4A1.7 1.7 0 0 0 7.5 8.8L7.2 8.3A2 2 0 0 1 9.3 5.3L9.9 5.5A1.7 1.7 0 0 0 12 4.4V4A2 2 0 0 1 16 4V4.4A1.7 1.7 0 0 0 18.1 5.5L18.7 5.3A2 2 0 0 1 20.8 8.3L20.5 8.8A1.7 1.7 0 0 0 19.4 11H20A2 2 0 0 1 20 15H19.4Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

export const FuelIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 21H15M4 21V5C4 4.4 4.4 4 5 4H13C13.6 4 14 4.4 14 5V21M6 9H12M14 9H16.5C17.3 9 18 9.7 18 10.5V17C18 17.6 18.4 18 19 18C19.6 18 20 17.6 20 17V8L18 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ZapIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.accent }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DropletIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2.69L5.64 9.05C2.12 12.57 2.12 18.27 5.64 21.79C9.16 25.31 14.86 25.31 18.38 21.79C21.9 18.27 21.9 12.57 18.38 9.05L12 2.69Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textSecondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.8" />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const RoadIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 22L8 2M20 22L16 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 5V8M12 12V15M12 19V22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22 20.48 21.53 20.94 20.97 20.92C15.68 20.62 10.74 17.84 7.21 14.31C3.68 10.78 0.9 5.84 0.6 0.55C0.58 -0.01 1.04 -0.48 1.6 -0.48H4.6C5.1 -0.48 5.53 -0.12 5.61 0.38C5.77 1.41 6.07 2.41 6.49 3.35C6.63 3.65 6.54 4 6.3 4.24L4.85 5.69C6.44 8.47 8.73 10.76 11.51 12.35L12.96 10.9C13.2 10.66 13.55 10.57 13.85 10.71C14.79 11.13 15.79 11.43 16.82 11.59C17.32 11.67 17.68 12.1 17.68 12.6V15.6"
      transform="translate(1, 1.5) scale(0.95)"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TruckIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 3H15V17H1V3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 8H19L22 12V17H15V8Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="1.8" />
    <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="1.8" />
  </Svg>
);

export const SproutIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 20H17M12 20V10M12 10C12 7 9.5 5 6 5C6 8.5 8 11 12 10ZM12 10C12 6.5 15 4 18 4C18 7.5 15.5 10 12 10Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrendingDownIcon: React.FC<IconProps> = ({ size = 20, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 18H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 18, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 3H21V9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 14L21 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BookmarkIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 20, color = COLORS.textPrimary, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V4C4 3.44772 4.44772 3 5 3H14C14.5523 3 15 3.44772 15 4V21M4 21H20M4 21H2M20 21V9C20 8.44772 19.5523 8 19 8H15M20 21H22M8 7H11M8 11H11M8 15H11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CameraIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GaugeIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.4142 10.5858L17.5 6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.34 19A10 10 0 1 1 20.66 19" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 20, color = COLORS.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);



