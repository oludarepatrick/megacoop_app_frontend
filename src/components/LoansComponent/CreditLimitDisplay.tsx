interface CreditLimitDisplayProps {
  isLoading: boolean;
  creditLimit?: number;
}

export const CreditLimitDisplay = ({ isLoading, creditLimit }: CreditLimitDisplayProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
      <p className="text-sm font-medium text-green-500">
        {isLoading ? (
          'Loading credit limit...'
        ) : (
          <>
            Your credit limit:{' '}
            <span className="font-semibold text-gray-700">
              ₦{creditLimit?.toLocaleString() || '100,000'}
            </span>
          </>
        )}
      </p>
      <div className="text-xs text-center text-white w-4 h-4 bg-green-500 rounded-full">?</div>
    </div>
  );
};