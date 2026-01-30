import React, { useState, useMemo, useCallback, ChangeEvent, FocusEvent } from 'react';

interface CountrySelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  label?: string;
  showSearch?: boolean;
}

type FormField = 'basicCountry' | 'searchableCountry' | 'requiredCountry';


const CountrySelectorComponent: React.FC<CountrySelectorProps> = ({
  id = 'country',
  name = 'country',
  value = '',
  placeholder = 'Select Country',
  onChange,
  onBlur,
  disabled = false,
  className = '',
  required = false,
  error = '',
  label,
  showSearch = false,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

const [formData, setFormData] = useState<Record<FormField, string>>({
  basicCountry: '',
  searchableCountry: '',
  requiredCountry: '',
});

const [errors, setErrors] = useState<Record<FormField, string>>({
  basicCountry: '',
  searchableCountry: '',
  requiredCountry: '',
});


  // Memoized countries list to prevent unnecessary re-renders
  const countries = useMemo(() => [
    { value: '', label: '- Select Country -' },
    { value: 'Afghanistan', label: 'Afghanistan' },
    { value: 'Albania', label: 'Albania' },
    { value: 'Algeria', label: 'Algeria' },
    { value: 'Andorra', label: 'Andorra' },
    { value: 'Angola', label: 'Angola' },
    { value: 'Antigua and Barbuda', label: 'Antigua and Barbuda' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Armenia', label: 'Armenia' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Azerbaijan', label: 'Azerbaijan' },
    { value: 'Bahamas', label: 'Bahamas' },
    { value: 'Bahrain', label: 'Bahrain' },
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Barbados', label: 'Barbados' },
    { value: 'Belarus', label: 'Belarus' },
    { value: 'Belgium', label: 'Belgium' },
    { value: 'Belize', label: 'Belize' },
    { value: 'Benin', label: 'Benin' },
    { value: 'Bhutan', label: 'Bhutan' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'Bosnia and Herzegovina', label: 'Bosnia and Herzegovina' },
    { value: 'Botswana', label: 'Botswana' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Brunei', label: 'Brunei' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Burkina Faso', label: 'Burkina Faso' },
    { value: 'Burundi', label: 'Burundi' },
    { value: 'Cambodia', label: 'Cambodia' },
    { value: 'Cameroon', label: 'Cameroon' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Cape Verde', label: 'Cape Verde' },
    { value: 'Central African Republic', label: 'Central African Republic' },
    { value: 'Chad', label: 'Chad' },
    { value: 'Chile', label: 'Chile' },
    { value: 'China', label: 'China' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Comoros', label: 'Comoros' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Croatia', label: 'Croatia' },
    { value: 'Cuba', label: 'Cuba' },
    { value: 'Cyprus', label: 'Cyprus' },
    { value: 'Czech Republic', label: 'Czech Republic' },
    { value: 'Democratic Republic of the Congo', label: 'Democratic Republic of the Congo' },
    { value: 'Denmark', label: 'Denmark' },
    { value: 'Djibouti', label: 'Djibouti' },
    { value: 'Dominica', label: 'Dominica' },
    { value: 'Dominican Republic', label: 'Dominican Republic' },
    { value: 'East Timor', label: 'East Timor' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egypt', label: 'Egypt' },
    { value: 'El Salvador', label: 'El Salvador' },
    { value: 'Equatorial Guinea', label: 'Equatorial Guinea' },
    { value: 'Eritrea', label: 'Eritrea' },
    { value: 'Estonia', label: 'Estonia' },
    { value: 'Ethiopia', label: 'Ethiopia' },
    { value: 'Fiji', label: 'Fiji' },
    { value: 'Finland', label: 'Finland' },
    { value: 'France', label: 'France' },
    { value: 'Gabon', label: 'Gabon' },
    { value: 'Gambia', label: 'Gambia' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Ghana', label: 'Ghana' },
    { value: 'Greece', label: 'Greece' },
    { value: 'Grenada', label: 'Grenada' },
    { value: 'Guatemala', label: 'Guatemala' },
    { value: 'Guinea', label: 'Guinea' },
    { value: 'Guinea-Bissau', label: 'Guinea-Bissau' },
    { value: 'Guyana', label: 'Guyana' },
    { value: 'Haiti', label: 'Haiti' },
    { value: 'Honduras', label: 'Honduras' },
    { value: 'Hungary', label: 'Hungary' },
    { value: 'Iceland', label: 'Iceland' },
    { value: 'India', label: 'India' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Iran', label: 'Iran' },
    { value: 'Iraq', label: 'Iraq' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'Israel', label: 'Israel' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Ivory Coast', label: 'Ivory Coast' },
    { value: 'Jamaica', label: 'Jamaica' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Jordan', label: 'Jordan' },
    { value: 'Kazakhstan', label: 'Kazakhstan' },
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Kiribati', label: 'Kiribati' },
    { value: 'Kosovo', label: 'Kosovo' },
    { value: 'Kuwait', label: 'Kuwait' },
    { value: 'Kyrgyzstan', label: 'Kyrgyzstan' },
    { value: 'Laos', label: 'Laos' },
    { value: 'Latvia', label: 'Latvia' },
    { value: 'Lebanon', label: 'Lebanon' },
    { value: 'Lesotho', label: 'Lesotho' },
    { value: 'Liberia', label: 'Liberia' },
    { value: 'Libya', label: 'Libya' },
    { value: 'Liechtenstein', label: 'Liechtenstein' },
    { value: 'Lithuania', label: 'Lithuania' },
    { value: 'Luxembourg', label: 'Luxembourg' },
    { value: 'Madagascar', label: 'Madagascar' },
    { value: 'Malawi', label: 'Malawi' },
    { value: 'Malaysia', label: 'Malaysia' },
    { value: 'Maldives', label: 'Maldives' },
    { value: 'Mali', label: 'Mali' },
    { value: 'Malta', label: 'Malta' },
    { value: 'Marshall Islands', label: 'Marshall Islands' },
    { value: 'Mauritania', label: 'Mauritania' },
    { value: 'Mauritius', label: 'Mauritius' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'Micronesia', label: 'Micronesia' },
    { value: 'Moldova', label: 'Moldova' },
    { value: 'Monaco', label: 'Monaco' },
    { value: 'Mongolia', label: 'Mongolia' },
    { value: 'Montenegro', label: 'Montenegro' },
    { value: 'Morocco', label: 'Morocco' },
    { value: 'Mozambique', label: 'Mozambique' },
    { value: 'Myanmar', label: 'Myanmar' },
    { value: 'Namibia', label: 'Namibia' },
    { value: 'Nauru', label: 'Nauru' },
    { value: 'Nepal', label: 'Nepal' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'Nicaragua', label: 'Nicaragua' },
    { value: 'Niger', label: 'Niger' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'North Korea', label: 'North Korea' },
    { value: 'North Macedonia', label: 'North Macedonia' },
    { value: 'Norway', label: 'Norway' },
    { value: 'Oman', label: 'Oman' },
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'Palau', label: 'Palau' },
    { value: 'Palestine', label: 'Palestine' },
    { value: 'Panama', label: 'Panama' },
    { value: 'Papua New Guinea', label: 'Papua New Guinea' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Qatar', label: 'Qatar' },
    { value: 'Republic of the Congo', label: 'Republic of the Congo' },
    { value: 'Romania', label: 'Romania' },
    { value: 'Russia', label: 'Russia' },
    { value: 'Rwanda', label: 'Rwanda' },
    { value: 'Saint Kitts and Nevis', label: 'Saint Kitts and Nevis' },
    { value: 'Saint Lucia', label: 'Saint Lucia' },
    { value: 'Saint Vincent and the Grenadines', label: 'Saint Vincent and the Grenadines' },
    { value: 'Samoa', label: 'Samoa' },
    { value: 'San Marino', label: 'San Marino' },
    { value: 'Sao Tome and Principe', label: 'Sao Tome and Principe' },
    { value: 'Saudi Arabia', label: 'Saudi Arabia' },
    { value: 'Senegal', label: 'Senegal' },
    { value: 'Serbia', label: 'Serbia' },
    { value: 'Seychelles', label: 'Seychelles' },
    { value: 'Sierra Leone', label: 'Sierra Leone' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Slovakia', label: 'Slovakia' },
    { value: 'Slovenia', label: 'Slovenia' },
    { value: 'Solomon Islands', label: 'Solomon Islands' },
    { value: 'Somalia', label: 'Somalia' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'South Korea', label: 'South Korea' },
    { value: 'South Sudan', label: 'South Sudan' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Sudan', label: 'Sudan' },
    { value: 'Suriname', label: 'Suriname' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'Switzerland', label: 'Switzerland' },
    { value: 'Syria', label: 'Syria' },
    { value: 'Taiwan', label: 'Taiwan' },
    { value: 'Tajikistan', label: 'Tajikistan' },
    { value: 'Tanzania', label: 'Tanzania' },
    { value: 'Thailand', label: 'Thailand' },
    { value: 'Togo', label: 'Togo' },
    { value: 'Tonga', label: 'Tonga' },
    { value: 'Trinidad and Tobago', label: 'Trinidad and Tobago' },
    { value: 'Tunisia', label: 'Tunisia' },
    { value: 'Turkey', label: 'Turkey' },
    { value: 'Turkmenistan', label: 'Turkmenistan' },
    { value: 'Tuvalu', label: 'Tuvalu' },
    { value: 'Uganda', label: 'Uganda' },
    { value: 'Ukraine', label: 'Ukraine' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Uzbekistan', label: 'Uzbekistan' },
    { value: 'Vanuatu', label: 'Vanuatu' },
    { value: 'Vatican City', label: 'Vatican City' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Vietnam', label: 'Vietnam' },
    { value: 'Yemen', label: 'Yemen' },
    { value: 'Zambia', label: 'Zambia' },
    { value: 'Zimbabwe', label: 'Zimbabwe' }
  ], []);

  // Filtered countries based on search term
  const filteredCountries = useMemo(() => {
    if (!showSearch || !searchTerm) return countries;
    return countries.filter(country =>
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm, showSearch]);

  // Memoized change handler to prevent unnecessary re-renders
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e);
  }, [onChange]);

  // Memoized blur handler
  const handleBlur = useCallback((e: FocusEvent<HTMLSelectElement>) => {
    onBlur?.(e);
    setIsOpen(false);
  }, [onBlur]);

  // Search functionality
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    if (showSearch) setIsOpen(true);
  }, [showSearch]);

  // Base styles with proper error state handling
  const baseStyles = `
    w-full px-3 py-2 bg-gray-800 border rounded-md text-white 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-transparent transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const borderStyles = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-600';

  const selectStyles = `${baseStyles} ${borderStyles} ${className}`;

  // Generate unique IDs for accessibility
  const selectId = id;
  const errorId = `${id}-error`;
  const labelId = `${id}-label`;

  return (
    <div className="w-full">
      {label && (
        <label 
          id={labelId}
          htmlFor={selectId}
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-400' : 'text-gray-300'
          }`}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {showSearch && (
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            className={`${baseStyles} border-gray-600`}
          />
        </div>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        required={required}
        className={selectStyles}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-labelledby={label ? labelId : undefined}
        {...props}
      >
        {filteredCountries.map((country) => (
          <option 
            key={country.value} 
            value={country.value} 
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            {country.label}
          </option>
        ))}
      </select>

      {error && (
        <p 
          id={errorId}
          className="mt-1 text-sm text-red-400 flex items-center gap-1"
          role="alert"
        >
          <span className="inline-block w-4 h-4 text-red-400">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};




// Demo component showing usage examples

/** 
const CountrySelectorDemo = () => {
  const [formData, setFormData] = useState({
    basicCountry: '',
    searchableCountry: '',
    requiredCountry: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
  (field: FormField) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  },
  [errors]
);

const xxhandleChange = useCallback(
  (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]); 

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.requiredCountry) {
      newErrors.requiredCountry = 'Please select a country';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    alert(`Form submitted successfully!\n\nSelected countries:\n- Basic: ${formData.basicCountry || 'None'}\n- Searchable: ${formData.searchableCountry || 'None'}\n- Required: ${formData.requiredCountry}`);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Country Selector Component Demo
        </h1>
        
        <div className="space-y-8">
          {/* Basic Country Selector * / }
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Country Selector</h2>
            <CountrySelector
              id="basic-country"
              name="basicCountry"
              label="Country of Origin"
              value={formData.basicCountry}
              onChange={handleChange('basicCountry')}
              placeholder="Choose your country"
            />
          </div>

          {/* Searchable Country Selector * /}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Searchable Country Selector</h2>
            <CountrySelector
              id="searchable-country"
              name="searchableCountry"
              label="Destination Country"
              value={formData.searchableCountry}
              onChange={handleChange('searchableCountry')}
              showSearch={true}
              placeholder="Search and select country"
            />
          </div>

          {/* Required Country Selector with Error * /}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Required Country Selector</h2>
            <CountrySelector
              id="required-country"
              name="requiredCountry"
              label="Country of Residence"
              value={formData.requiredCountry}
              onChange={handleChange('requiredCountry')}
              required={true}
              error={errors.requiredCountry}
              placeholder="Select your country of residence"
            />
          </div>

          {/* Submit button * /}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              Submit Form
            </button>
          </div>
        </div>

        {/* Current selections display * /}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Current Selections:</h3>
          <div className="space-y-2 text-gray-300">
            <p><strong>Basic:</strong> {formData.basicCountry || 'None selected'}</p>
            <p><strong>Searchable:</strong> {formData.searchableCountry || 'None selected'}</p>
            <p><strong>Required:</strong> {formData.requiredCountry || 'None selected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
*/
export default CountrySelectorComponent;