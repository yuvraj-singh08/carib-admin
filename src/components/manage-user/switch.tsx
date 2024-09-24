import { cn } from '@/lib/utils';

const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) => {
  const handleToggle = () => {
    const newState = !checked;
    if (onCheckedChange) {
      onCheckedChange(newState);
    }
  };

  return (
    <button
      className={`relative h-5 w-10 cursor-pointer rounded-full duration-200`}
      onClick={handleToggle}
      style={{
        backgroundColor: checked ? '#052E73' : '#24252d50',
      }}
      type='button'
    >
      <span
        className={cn(
          `absolute right-3 top-0 rounded-full bg-white shadow-lg transition-all duration-200`,
          checked ? 'translate-x-full transform ' : 'translate-x-0 transform left-0',
          'size-3 m-1'
        )}
      />
    </button>
  );
};

export default Switch;
