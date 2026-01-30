import React, { useState, useEffect } from 'react';
import { User, Building, CreditCard, Globe, MapPin } from 'lucide-react';

interface AccountDetailsProps {
  value?: string; // JSON string input
  onChange?: (jsonString: string) => void; // Returns JSON string
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

interface AccountDetails {
  name: string;
  bankName: string;
  accountNumber: string;
  swiftBicCode: string;
  countryTerritory: string;
}

// Countries data for dropdown
const countries = [
  'Nigeria', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'South Africa', 'Ghana', 'Kenya', 'Brazil',
  'India', 'Japan', 'China', 'Mexico', 'Italy', 'Spain', 'Netherlands'
];

// Input Field Component
const InputField = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = ''
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all backdrop-blur-sm ${
        error
          ? 'border-red-500 focus:border-red-400'
          : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

// Select Field Component
const SelectField = ({
  options,
  value,
  onChange,
  error,
  placeholder = "Select...",
  icon,
  required = false,
  disabled = false
}: {
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <select
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none transition-all backdrop-blur-sm appearance-none ${
        error
          ? 'border-red-500 focus:border-red-400'
          : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      required={required}
    >
      <option value="" className="bg-gray-800">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option} className="bg-gray-800 text-white">
          {option}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

const AccountDetailsComponent: React.FC<AccountDetailsProps> = ({
  value = '',
  onChange,
  error,
  disabled = false,
  required = false
}) => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: '',
    bankName: '',
    accountNumber: '',
    swiftBicCode: '',
    countryTerritory: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<AccountDetails>>({});

  // Parse JSON input when value changes
  useEffect(() => {
    if (value && value.trim() !== '') {
      try {
        const parsed = JSON.parse(value);
        setAccountDetails({
          name: parsed.name || '',
          bankName: parsed.bankName || '',
          accountNumber: parsed.accountNumber || '',
          swiftBicCode: parsed.swiftBicCode || '',
          countryTerritory: parsed.countryTerritory || ''
        });
      } catch (error) {
        // If parsing fails, reset to empty state
        console.warn('Failed to parse account details JSON:', error);
      }
    }
  }, [value]);

  // Handle field changes
  const handleFieldChange = (field: keyof AccountDetails, fieldValue: string) => {
    const updatedDetails = {
      ...accountDetails,
      [field]: fieldValue
    };

    setAccountDetails(updatedDetails);

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Convert to JSON string and call onChange
    const jsonString = JSON.stringify(updatedDetails, null, 0);
    onChange?.(jsonString);
  };

  // Validation
  const validateFields = () => {
    const errors: Partial<AccountDetails> = {};
    
    if (required) {
      if (!accountDetails.name.trim()) errors.name = 'Account holder name is required';
      if (!accountDetails.bankName.trim()) errors.bankName = 'Bank name is required';
      if (!accountDetails.accountNumber.trim()) errors.accountNumber = 'Account number is required';
      if (!accountDetails.countryTerritory.trim()) errors.countryTerritory = 'Country is required';
    }

    // Account number validation (basic)
    if (accountDetails.accountNumber.trim() && accountDetails.accountNumber.trim().length < 8) {
      errors.accountNumber = 'Account number seems too short';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Auto-validate when fields change
  useEffect(() => {
    if (required && (accountDetails.name || accountDetails.bankName || accountDetails.accountNumber)) {
      validateFields();
    }
  }, [accountDetails, required]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Bank Account Details</h3>
        {required && <span className="text-red-400">*</span>}
      </div>

      <div className="bg-gray-800/30 rounded-xl p-6 space-y-4 border border-gray-700/50">
        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Account Holder Name {required && <span className="text-red-400">*</span>}
          </label>
          <InputField
            placeholder="Full name as it appears on bank account"
            value={accountDetails.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={fieldErrors.name}
            icon={<User className="w-5 h-5 text-gray-400" />}
            required={required}
            disabled={disabled}
          />
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bank Name {required && <span className="text-red-400">*</span>}
          </label>
          <InputField
            placeholder="Name of your bank institution"
            value={accountDetails.bankName}
            onChange={(e) => handleFieldChange('bankName', e.target.value)}
            error={fieldErrors.bankName}
            icon={<Building className="w-5 h-5 text-gray-400" />}
            required={required}
            disabled={disabled}
          />
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Account Number {required && <span className="text-red-400">*</span>}
          </label>
          <InputField
            placeholder="Your bank account number"
            value={accountDetails.accountNumber}
            onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
            error={fieldErrors.accountNumber}
            icon={<CreditCard className="w-5 h-5 text-gray-400" />}
            required={required}
            disabled={disabled}
          />
        </div>

        {/* SWIFT/BIC Code */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            SWIFT/BIC Code <span className="text-gray-500">(Optional for international transfers)</span>
          </label>
          <InputField
            placeholder="8 or 11 character SWIFT/BIC code"
            value={accountDetails.swiftBicCode}
            onChange={(e) => handleFieldChange('swiftBicCode', e.target.value.toUpperCase())}
            error={fieldErrors.swiftBicCode}
            icon={<Globe className="w-5 h-5 text-gray-400" />}
            disabled={disabled}
            className="uppercase"
          />
        </div>

        {/* Country/Territory */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country/Territory {required && <span className="text-red-400">*</span>}
          </label>
          <SelectField
            options={countries}
            value={accountDetails.countryTerritory}
            onChange={(e) => handleFieldChange('countryTerritory', e.target.value)}
            error={fieldErrors.countryTerritory}
            placeholder="Select your bank's country"
            icon={<MapPin className="w-5 h-5 text-gray-400" />}
            required={required}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Overall Error Display */}
      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {error}
        </p>
      )}

      {/* JSON Preview (for debugging - remove in production) */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
        <h4 className="text-xs font-medium text-gray-400 mb-2">JSON Output Preview:</h4>
        <pre className="text-xs text-gray-300 font-mono bg-black/30 rounded p-2 overflow-x-auto">
          {JSON.stringify(accountDetails, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AccountDetailsComponent;