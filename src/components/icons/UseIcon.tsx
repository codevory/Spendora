interface NavIconProps {
  name: 'dashboard' | 'analytics' | 'settings' | 'moon' | 'sun' | 'menu-toggle' | 'pencil' |
  'transactions' | 'categoryTag' | 'profile' | 'home' | 'categoriesTag';
  isDarkMode: boolean;
  size?:number
}

export const NavIcon = ({ name, isDarkMode,size=30 }: NavIconProps) => {
  const iconColor = isDarkMode ? 'white' : '#0e2a4d';

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      speed={100}
      viewBox="0 0 24 24" 
      style={{ 
        color: iconColor, 
        fill: iconColor, 
        stroke: 'currentColor',
        transition: 'color 0.3s ease, transform 0.3s ease',
      }}
    >
      <use href={`/icons-sprite.svg#icon-${name}`}></use>
    </svg>
  );
};