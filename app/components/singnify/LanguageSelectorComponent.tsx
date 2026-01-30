"use client"
import React, {
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  FocusEvent,
  SelectHTMLAttributes
} from 'react';

interface Language {
  value: string;
  label: string;
  code: string;
}

interface LanguageSelectorProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur'> {
  id?: string;
  name?: string;
  value: string;
  placeholder?: string;
  label?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  showSearch?: boolean;
  showCodes?: boolean;
}

const LanguageSelectorComponent: React.FC<LanguageSelectorProps> = ({
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
  const filteredLanguages = useMemo(() => {
    if (!showSearch || !searchTerm) return languages;
    return languages.filter(language =>
      language.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (showCodes && language.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [languages, searchTerm, showSearch, showCodes]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLSelectElement>) => {
      onBlur?.(e);
      setIsOpen(false);
    },
    [onBlur]
  );

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleFocus = useCallback(() => {
    if (showSearch) setIsOpen(true);
  }, [showSearch]);

  const baseStyles = `
    w-full px-3 py-2 bg-gray-800 border rounded-md text-white 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-transparent transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const borderStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600';
  const selectStyles = `${baseStyles} ${borderStyles} ${className}`;
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
        {filteredLanguages.map(language => (
          <option
            key={language.value}
            value={language.value}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            {showCodes && language.code
              ? `${language.label} (${language.code})`
              : language.label}
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

export default LanguageSelectorComponent;

/** 
export default function LanguageFormDemo() {
  const [formData, setFormData] = useState<FormData>({
    nativeLanguage: '',
    learningLanguage: '',
    preferredLanguage: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback(
    (field: keyof FormData) =>
      (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;

        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  const handleSubmit = () => {
    const newErrors: FormErrors = {};

    if (!formData.preferredLanguage) {
      newErrors.preferredLanguage = 'Please select a preferred language';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-6 font-semibold">Language Selector Demo</h1>

      <div className="space-y-6">
        <LanguageSelectorComponent
          id="native-language"
          label="Native Language"
          value={formData.nativeLanguage}
          onChange={handleChange('nativeLanguage')}
        />

        <LanguageSelectorComponent
          id="learning-language"
          label="Learning Language"
          value={formData.learningLanguage}
          onChange={handleChange('learningLanguage')}
          showSearch
          showCodes
        />

        <LanguageSelectorComponent
          id="preferred-language"
          label="Preferred Interface Language"
          value={formData.preferredLanguage}
          onChange={handleChange('preferredLanguage')}
          required
          error={errors.preferredLanguage}
        />

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
*/