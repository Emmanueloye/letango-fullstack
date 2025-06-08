const Button = ({
  btnText,
  btnType,
  bg = 'green-600',
  color = 'text-white',
  disabled = false,
  className = 'px-3 py-2',
  onTrigger,
}: {
  btnText: string;
  btnType: 'submit' | 'button' | 'reset';
  bg?: string;
  color?: string;
  disabled?: boolean;
  className?: string;
  onTrigger?: () => void;
}) => {
  return (
    <button
      onClick={() => onTrigger?.()}
      type={btnType}
      disabled={disabled}
      className={`bg-${bg} hover:bg-green-400 rounded-md w-full capitalize ${color} font-600 cursor-pointer disabled:bg-gray-500 ${className}`}
    >
      {btnText}
    </button>
  );
};

export default Button;
