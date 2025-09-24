import { forwardRef } from 'react';

const CustomButton = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 focus:outline-none transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100';
  
  const variants = {
    primary: 'bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-lg hover:shadow-xl focus:ring-4 focus:ring-amber-300/50',
    secondary: 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 backdrop-blur-md focus:ring-4 focus:ring-slate-300/50',
    success: 'bg-[#10b981] hover:bg-[#059669] text-white shadow-lg hover:shadow-xl focus:ring-4 focus:ring-emerald-300/50',
    danger: 'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg hover:shadow-xl focus:ring-4 focus:ring-red-300/50',
    info: 'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-lg hover:shadow-xl focus:ring-4 focus:ring-orange-300/50'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };
  
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;
