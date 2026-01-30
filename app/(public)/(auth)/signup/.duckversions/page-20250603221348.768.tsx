'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthContainer } from '@/app/components/ui/auth/AuthContainer';
import { AuthInput } from '@/app/components/ui/auth/AuthInput';
import { StepIndicator } from '@/app/components/ui/auth/StepIndicator';
import { AUTH_CONSTANTS } from '@/app/constants/auth';
import { User, Upload, MessageSquare, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    gender: '',
    is_artist: 1, // Changed to number type as API expects 1 or 0
    stage_name: '',
    record_label: '',
    about: '',
    uname: '',
    ref_code: '',
  });
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'first_name' && !prev.uname ? { uname: value.toString().toLowerCase() } : {}),
    }));
  };

  const validateForm = () => {
    const requiredFields: Record<number, string[]> = {
      1: ['first_name', 'last_name', 'email', 'password', 'uname'],
      2: ['phone', 'country', 'gender'],
      3: ['stage_name']
    };

    const currentFields = requiredFields[step];
    for (const field of currentFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in the ${field.replace('_', ' ')} field.`);
        return false;
      }
    }

    if (step === 1 && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    }

    // Validate password strength
    if (step === 1 && formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    setError(null);
    return true;
  };

  const renderStepContent = () => {
    const steps = [
      {
        icon: <User className="w-32 h-32 text-gray-100 bg-blue-600 p-4 rounded-full" />,
        title: "Basic Information",
        subtitle: "Let's get started with your account setup"
      },
      {
        icon: <Upload className="w-32 h-32 text-gray-100 bg-blue-600 p-4 rounded-full" />,
        title: "Personal Details",
        subtitle: `Hi ${formData.first_name}, tell us more about yourself`
      },
      {
        icon: <MessageSquare className="w-32 h-32 text-gray-100 bg-blue-600 p-4 rounded-full" />,
        title: "Artist Information",
        subtitle: "Complete your artist profile"
      }
    ];

    const currentStep = steps[step - 1];

    return (
      <Card className="border-none shadow-none">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              {currentStep.icon}
            </div>
            <h2 className="text-lg font-semibold text-center">{currentStep.title}</h2>
            <p className="text-muted-foreground text-center">{currentStep.subtitle}</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AuthInput
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  required
                />
                <AuthInput
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  required
                />
              </div>
              <AuthInput
                label="Username"
                value={formData.uname}
                onChange={(e) => updateFormData('uname', e.target.value)}
                prefix="@"
                required
              />
              <AuthInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
              <AuthInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <AuthInput
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+2347039247359"
                required
              />
              <AuthInput
                label="Country"
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender *</label>
                <select
                  className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary"
                  value={formData.gender}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <AuthInput
                label="Stage Name"
                value={formData.stage_name}
                onChange={(e) => updateFormData('stage_name', e.target.value)}
                required
              />
              <AuthInput
                label="Record Label"
                value={formData.record_label}
                onChange={(e) => updateFormData('record_label', e.target.value)}
              />
              <AuthInput
                label="Referral Code (Optional)"
                value={formData.ref_code}
                onChange={(e) => updateFormData('ref_code', e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type *</label>
                <select
                  className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary"
                  value={formData.is_artist}
                  onChange={(e) => updateFormData('is_artist', parseInt(e.target.value))}
                  required
                >
                  <option value={1}>Artist Account</option>
                  <option value={0}>Regular User Account</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">About</label>
                <textarea
                  className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary min-h-[120px]"
                  placeholder="Tell us about your journey as an artist..."
                  value={formData.about}
                  onChange={(e) => updateFormData('about', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the request body as JSON
      const requestBody = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        country: formData.country,
        gender: formData.gender,
        is_artist: formData.is_artist,
        stage_name: formData.stage_name,
        record_label: formData.record_label,
        about: formData.about,
        uname: formData.uname,
        ref_code: formData.ref_code,
        API_KEY: AUTH_CONSTANTS.API_KEY
      };

      console.log('Submitting registration data:', requestBody);

      const response = await fetch('https://singnify.com/api/v2/php/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      
      // Get response text first to handle potential non-JSON responses
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Server returned invalid response format');
      }

      console.log('Parsed response:', data);

      // Check for successful registration
      if (data.status === '200' || data.status === 200) {
        // Success - redirect to login with success message
        router.push('/login?registered=true');
      } else {
        // Handle API error response
        const errorMessage = data.message || data.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Registration failed:', data);
      }

    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer title="Register">
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <StepIndicator currentStep={step} totalSteps={3} />
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              )}
              <Button
                type="submit"
                className="ml-auto flex items-center space-x-2"
                disabled={loading}
              >
                <span>
                  {loading ? 'Creating Account...' : step === 3 ? 'Create Account' : 'Continue'}
                </span>
                {step === 3 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthContainer>
  );
}