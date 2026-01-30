import React, { useState, useMemo, useCallback } from 'react';

const LanguageSelector = ({
  id = 'language',
  name = 'language',
  value = '',
  placeholder = 'Select Language',
  onChange,
  onBlur,
  disabled = false,
  className = '',
  required = false,
  error = '',
  label,
  showSearch = false,
  showCodes = false,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Memoized languages list to prevent unnecessary re-renders
  const languages = useMemo(() => [
    { value: '', label: '- Select Language -', code: '' },
    { value: 'Afrikaans', label: 'Afrikaans', code: 'af' },
    { value: 'Albanian', label: 'Albanian', code: 'sq' },
    { value: 'Amharic', label: 'Amharic', code: 'am' },
    { value: 'Arabic', label: 'Arabic', code: 'ar' },
    { value: 'Armenian', label: 'Armenian', code: 'hy' },
    { value: 'Azerbaijani', label: 'Azerbaijani', code: 'az' },
    { value: 'Basque', label: 'Basque', code: 'eu' },
    { value: 'Belarusian', label: 'Belarusian', code: 'be' },
    { value: 'Bengali', label: 'Bengali', code: 'bn' },
    { value: 'Bosnian', label: 'Bosnian', code: 'bs' },
    { value: 'Bulgarian', label: 'Bulgarian', code: 'bg' },
    { value: 'Catalan', label: 'Catalan', code: 'ca' },
    { value: 'Cebuano', label: 'Cebuano', code: 'ceb' },
    { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)', code: 'zh-cn' },
    { value: 'Chinese (Traditional)', label: 'Chinese (Traditional)', code: 'zh-tw' },
    { value: 'Corsican', label: 'Corsican', code: 'co' },
    { value: 'Croatian', label: 'Croatian', code: 'hr' },
    { value: 'Czech', label: 'Czech', code: 'cs' },
    { value: 'Danish', label: 'Danish', code: 'da' },
    { value: 'Dutch', label: 'Dutch', code: 'nl' },
    { value: 'English', label: 'English', code: 'en' },
    { value: 'Esperanto', label: 'Esperanto', code: 'eo' },
    { value: 'Estonian', label: 'Estonian', code: 'et' },
    { value: 'Finnish', label: 'Finnish', code: 'fi' },
    { value: 'French', label: 'French', code: 'fr' },
    { value: 'Frisian', label: 'Frisian', code: 'fy' },
    { value: 'Galician', label: 'Galician', code: 'gl' },
    { value: 'Georgian', label: 'Georgian', code: 'ka' },
    { value: 'German', label: 'German', code: 'de' },
    { value: 'Greek', label: 'Greek', code: 'el' },
    { value: 'Gujarati', label: 'Gujarati', code: 'gu' },
    { value: 'Haitian Creole', label: 'Haitian Creole', code: 'ht' },
    { value: 'Hausa', label: 'Hausa', code: 'ha' },
    { value: 'Hawaiian', label: 'Hawaiian', code: 'haw' },
    { value: 'Hebrew', label: 'Hebrew', code: 'he' },
    { value: 'Hindi', label: 'Hindi', code: 'hi' },
    { value: 'Hmong', label: 'Hmong', code: 'hmn' },
    { value: 'Hungarian', label: 'Hungarian', code: 'hu' },
    { value: 'Icelandic', label: 'Icelandic', code: 'is' },
    { value: 'Igbo', label: 'Igbo', code: 'ig' },
    { value: 'Indonesian', label: 'Indonesian', code: 'id' },
    { value: 'Irish', label: 'Irish', code: 'ga' },
    { value: 'Italian', label: 'Italian', code: 'it' },
    { value: 'Japanese', label: 'Japanese', code: 'ja' },
    { value: 'Javanese', label: 'Javanese', code: 'jw' },
    { value: 'Kannada', label: 'Kannada', code: 'kn' },
    { value: 'Kazakh', label: 'Kazakh', code: 'kk' },
    { value: 'Khmer', label: 'Khmer', code: 'km' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda', code: 'rw' },
    { value: 'Korean', label: 'Korean', code: 'ko' },
    { value: 'Kurdish', label: 'Kurdish', code: 'ku' },
    { value: 'Kyrgyz', label: 'Kyrgyz', code: 'ky' },
    { value: 'Lao', label: 'Lao', code: 'lo' },
    { value: 'Latin', label: 'Latin', code: 'la' },
    { value: 'Latvian', label: 'Latvian', code: 'lv' },
    { value: 'Lithuanian', label: 'Lithuanian', code: 'lt' },
    { value: 'Luxembourgish', label: 'Luxembourgish', code: 'lb' },
    { value: 'Macedonian', label: 'Macedonian', code: 'mk' },
    { value: 'Malagasy', label: 'Malagasy', code: 'mg' },
    { value: 'Malay', label: 'Malay', code: 'ms' },
    { value: 'Malayalam', label: 'Malayalam', code: 'ml' },
    { value: 'Maltese', label: 'Maltese', code: 'mt' },
    { value: 'Maori', label: 'Maori', code: 'mi' },
    { value: 'Marathi', label: 'Marathi', code: 'mr' },
    { value: 'Mongolian', label: 'Mongolian', code: 'mn' },
    { value: 'Myanmar', label: 'Myanmar (Burmese)', code: 'my' },
    { value: 'Nepali', label: 'Nepali', code: 'ne' },
    { value: 'Norwegian', label: 'Norwegian', code: 'no' },
    { value: 'Nyanja', label: 'Nyanja (Chichewa)', code: 'ny' },
    { value: 'Odia', label: 'Odia (Oriya)', code: 'or' },
    { value: 'Pashto', label: 'Pashto', code: 'ps' },
    { value: 'Persian', label: 'Persian', code: 'fa' },
    { value: 'Polish', label: 'Polish', code: 'pl' },
    { value: 'Portuguese', label: 'Portuguese', code: 'pt' },
    { value: 'Punjabi', label: 'Punjabi', code: 'pa' },
    { value: 'Romanian', label: 'Romanian', code: 'ro' },
    { value: 'Russian', label: 'Russian', code: 'ru' },
    { value: 'Samoan', label: 'Samoan', code: 'sm' },
    { value: 'Scots Gaelic', label: 'Scots Gaelic', code: 'gd' },
    { value: 'Serbian', label: 'Serbian', code: 'sr' },
    { value: 'Sesotho', label: 'Sesotho', code: 'st' },
    { value: 'Shona', label: 'Shona', code: 'sn' },
    { value: 'Sindhi', label: 'Sindhi', code: 'sd' },
    { value: 'Sinhala', label: 'Sinhala (Sinhalese)', code: 'si' },
    { value: 'Slovak', label: 'Slovak', code: 'sk' },
    { value: 'Slovenian', label: 'Slovenian', code: 'sl' },
    { value: 'Somali', label: 'Somali', code: 'so' },
    { value: 'Spanish', label: 'Spanish', code: 'es' },
    { value: 'Sundanese', label: 'Sundanese', code: 'su' },
    { value: 'Swahili', label: 'Swahili', code: 'sw' },
    { value: 'Swedish', label: 'Swedish', code: 'sv' },
    { value: 'Tagalog', label: 'Tagalog (Filipino)', code: 'tl' },
    { value: 'Tajik', label: 'Tajik', code: 'tg' },
    { value: 'Tamil', label: 'Tamil', code: 'ta' },
    { value: 'Tatar', label: 'Tatar', code: 'tt' },
    { value: 'Telugu', label: 'Telugu', code: 'te' },
    { value: 'Thai', label: 'Thai', code: 'th' },
    { value: 'Turkish', label: 'Turkish', code: 'tr' },
    { value: 'Turkmen', label: 'Turkmen', code: 'tk' },
    { value: 'Ukrainian', label: 'Ukrainian', code: 'uk' },
    { value: 'Urdu', label: 'Urdu', code: 'ur' },
    { value: 'Uyghur', label: 'Uyghur', code: 'ug' },
    { value: 'Uzbek', label: 'Uzbek', code: 'uz' },
    { value: 'Vietnamese', label: 'Vietnamese', code: 'vi' },
    { value: 'Welsh', label: 'Welsh', code: 'cy' },
    { value: 'Xhosa', label: 'Xhosa', code: 'xh' },
    { value: 'Yiddish', label: 'Yiddish', code: 'yi' },
    { value: 'Yoruba', label: 'Yoruba', code: 'yo' },
    { value: 'Zulu', label: 'Zulu', code: 'zu' }
  ], []);

  // Filtered languages based on search term
  const filteredLanguages = useMemo(() => {
    if (!showSearch || !searchTerm) return languages;
    return languages.filter(language =>
      language.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (showCodes && language.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [languages, searchTerm, showSearch, showCodes]);

  // Memoized change handler to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    onChange?.(e);
  }, [onChange]);

  // Memoized blur handler
  const handleBlur = useCallback((e) => {
    onBlur?.(e);
    setIsOpen(false);
  }, [onBlur]);

  // Search functionality
  const handleSearchChange = useCallback((e) => {
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
            placeholder="Search languages..."
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
        {filteredLanguages.map((language) => (
          <option 
            key={language.value} 
            value={language.value} 
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            {showCodes && language.code 
              ? `${language.label} (${language.code})` 
              : language.label
            }
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
const LanguageSelectorDemo = () => {
  const [formData, setFormData] = useState({
    nativeLanguage: '',
    learningLanguage: '',
    preferredLanguage: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field) => (e) => {
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

  const handleSubmit = useCallback(() => {
    const newErrors = {};
    
    if (!formData.preferredLanguage) {
      newErrors.preferredLanguage = 'Please select a preferred language';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    alert(`Form submitted successfully!\n\nSelected languages:\n- Native: ${formData.nativeLanguage || 'None'}\n- Learning: ${formData.learningLanguage || 'None'}\n- Preferred: ${formData.preferredLanguage}`);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Language Selector Component Demo
        </h1>
        
        <div className="space-y-8">
          {/* Basic Language Selector */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Native Language</h2>
            <LanguageSelector
              id="native-language"
              name="nativeLanguage"
              label="What is your native language?"
              value={formData.nativeLanguage}
              onChange={handleChange('nativeLanguage')}
              placeholder="Select your native language"
            />
          </div>

          {/* Searchable Language Selector with Codes */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Learning Language</h2>
            <LanguageSelector
              id="learning-language"
              name="learningLanguage"
              label="Which language are you learning?"
              value={formData.learningLanguage}
              onChange={handleChange('learningLanguage')}
              showSearch={true}
              showCodes={true}
              placeholder="Search for a language"
            />
          </div>

          {/* Required Language Selector with Error */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Preferred Language</h2>
            <LanguageSelector
              id="preferred-language"
              name="preferredLanguage"
              label="Preferred interface language"
              value={formData.preferredLanguage}
              onChange={handleChange('preferredLanguage')}
              required={true}
              error={errors.preferredLanguage}
              placeholder="Select your preferred language"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              Submit Form
            </button>
          </div>
        </div>

        {/* Current selections display */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Current Selections:</h3>
          <div className="space-y-2 text-gray-300">
            <p><strong>Native Language:</strong> {formData.nativeLanguage || 'None selected'}</p>
            <p><strong>Learning Language:</strong> {formData.learningLanguage || 'None selected'}</p>
            <p><strong>Preferred Language:</strong> {formData.preferredLanguage || 'None selected'}</p>
          </div>
        </div>

        {/* Feature showcase */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="space-y-2">
              <p>✅ 100+ Languages included</p>
              <p>✅ Search functionality</p>
              <p>✅ Language codes display</p>
              <p>✅ Accessibility compliant</p>
            </div>
            <div className="space-y-2">
              <p>✅ Error handling</p>
              <p>✅ Required field validation</p>
              <p>✅ Responsive design</p>
              <p>✅ Dark theme optimized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorDemo;