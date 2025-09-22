// components/ui/loader.tsx
export function Loader({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-10 w-10 text-green ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className=""
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="0"
      />
      <path
        className="opacity-95"
        fill="#0F7033"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
