import { forwardRef } from 'react';

const CustomTextarea = forwardRef(({ 
  label,
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
                className={`w-full px-6 py-4 bg-white/70 border border-slate-200/50 rounded-2xl shadow-lg focus:ring-4 focus:ring-amber-300/50 text-slate-800 placeholder-slate-500 transition-all duration-300 backdrop-blur-md resize-none hover:bg-white/80 hover:border-slate-300/60 ${error ? 'ring-red-400 focus:ring-red-300/50' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
});

CustomTextarea.displayName = 'CustomTextarea';

export default CustomTextarea;
