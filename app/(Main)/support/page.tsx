// app/support/page.tsx
"use client";

import { useState } from 'react';
import { 
  Headphones, Mail, MessageCircle, Phone, Clock, 
  CheckCircle, AlertCircle, Upload, User, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import TrackUploadComponent from '@/app/components/singnify/TrackUplaodComponent';

interface FAQItem {
  question: string;
  answer: string;
}

interface SupportCategory {
  id: string;
  title: string;
  description: string;
}

interface TrackUploadResponse {
  status: string | number;
  message: string;
  link: string;
  duration?: string;
}

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState<string>('technical');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadDuration, setUploadDuration] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "How do I upload my music?",
      answer: "You can upload your music through the Upload section in your artist dashboard. Supported formats include MP3, WAV, and FLAC files up to 500MB."
    },
    {
      question: "How long does distribution take?",
      answer: "Typically, distribution to major platforms takes 24-72 hours. Some platforms may take up to 2 weeks for your music to appear."
    },
    {
      question: "How do I get paid for my streams?",
      answer: "We process royalties monthly. You need to set up your payment information in the Payment section of your dashboard. Payouts are made around the 15th of each month."
    },
    {
      question: "Can I distribute cover songs?",
      answer: "Yes, but you need to obtain a mechanical license for cover songs. We can help you through this process for an additional fee."
    },
    {
      question: "How do I update my release after distribution?",
      answer: "Once distributed, most metadata cannot be changed. For critical changes, contact our support team within 24 hours of submission."
    }
  ];

  const supportCategories: SupportCategory[] = [
    {
      id: 'technical',
      title: 'Technical Issues',
      description: 'Problems with uploading, app functionality, or technical errors'
    },
    {
      id: 'distribution',
      title: 'Distribution Questions',
      description: 'Questions about music distribution, timelines, and platforms'
    },
    {
      id: 'payment',
      title: 'Payment & Royalties',
      description: 'Issues with payments, royalty calculations, or payout methods'
    },
    {
      id: 'account',
      title: 'Account Management',
      description: 'Help with account settings, profile updates, or access issues'
    },
    {
      id: 'other',
      title: 'Other Inquiries',
      description: 'Any other questions or concerns not covered above'
    }
  ];

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Include uploaded file info in submission
      const formData = {
        category: activeCategory,
        message,
        audioFile: uploadedFileUrl,
        duration: uploadDuration
      };
      
      console.log('Form submission:', formData);
      
      setSubmitStatus('success');
      setMessage('');
      setUploadedFileUrl(null);
      setUploadDuration(null);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number): void => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleTrackUpload = (fileUrl: string | null, response?: TrackUploadResponse): void => {
    console.log('File uploaded:', fileUrl, response);
    setUploadedFileUrl(fileUrl);
    if (response?.duration) {
      setUploadDuration(response.duration);
    }
  };

  const handleTrackUploadError = (error: Error): void => {
    console.error('Upload error:', error);
    setUploadedFileUrl(null);
    setUploadDuration(null);
  };

  const handleTrackUploadSuccess = (fileUrl: string, response: TrackUploadResponse): void => {
    console.log('Upload success:', fileUrl, response);
    setUploadedFileUrl(fileUrl);
    if (response.duration) {
      setUploadDuration(response.duration);
    }
  };

  const handleDurationChange = (duration: string): void => {
    console.log('Track duration:', duration);
    setUploadDuration(duration);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Headphones className="h-8 w-8 text-indigo-500 mr-3" />
            <h1 className="text-3xl font-bold">Support Center</h1>
          </div>
          <p className="text-gray-400 mt-2">
            Get help with your account, distribution, payments, and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Contact Form */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {supportCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          activeCategory === category.id
                            ? 'border-indigo-500 bg-indigo-500/10 text-white'
                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {category.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {category.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attach Audio File (if applicable)
                  </label>
                  <TrackUploadComponent
                    apiKey="7c6a180b36896a0a8c02787eeafb0e4c"
                    apiEndpoint="https://singnify.com/api/v2/php/upload-track.php"
                    onChange={handleTrackUpload}
                  //  onError={handleTrackUploadError}
                    onSuccess={handleTrackUploadSuccess}
                 //   onDurationChange={handleDurationChange}
                  />
                  {uploadDuration && (
                    <p className="text-xs text-gray-400 mt-2">
                      Track duration: {uploadDuration}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-300">
                      Your message has been sent successfully! We'll get back to you within 24 hours.
                    </span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-300">
                      There was an error sending your message. Please try again.
                    </span>
                  </div>
                )}
              </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left flex items-center justify-between py-3 font-medium text-gray-200 hover:text-white"
                    >
                      <span>{item.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="pl-2 pb-3 text-gray-300">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-indigo-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Email</p>
                    <p className="text-white">support@singnify.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-indigo-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Phone</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-indigo-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Response Time</p>
                    <p className="text-white">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Resources */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Support Resources</h3>
              <div className="space-y-3">
                <a href="/help/upload-guide" className="flex items-center text-gray-300 hover:text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Guide
                </a>
                <a href="/help/distribution" className="flex items-center text-gray-300 hover:text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Distribution FAQ
                </a>
                <a href="/help/payments" className="flex items-center text-gray-300 hover:text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Payment Help
                </a>
                <a href="/help/account" className="flex items-center text-gray-300 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Account Management
                </a>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="bg-indigo-900/30 border border-indigo-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-200">Urgent Issues</h3>
              <p className="text-sm text-indigo-300 mb-4">
                For critical issues affecting your releases or account, contact us immediately:
              </p>
              <div className="space-y-2">
                <p className="text-white text-sm font-medium">emergency@singnify.com</p>
                <p className="text-indigo-300 text-xs">
                  Available 24/7 for urgent distribution issues
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}