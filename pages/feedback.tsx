import { useState } from 'react';
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Star, 
  Send,
  CheckCircle,
  AlertCircle,
  Heart,
  TrendingUp,
  Users,
  ArrowRight
} from 'lucide-react';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    rating: 0,
    subject: '',
    message: '',
    tool: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'blue' },
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'red' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'green' },
    { value: 'improvement', label: 'Improvement Suggestion', icon: TrendingUp, color: 'purple' }
  ];

  const tools = [
    'API Code Generator',
    'GraphQL Query Generator',
    'Docker Compose Generator',
    'GitHub Actions Generator',
    'Kubernetes YAML Generator',
    'Mock Data Generator'
  ];

  const stats = [
    { icon: MessageSquare, value: '500+', label: 'Feedback Received' },
    { icon: CheckCircle, value: '95%', label: 'Issues Resolved' },
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Heart, value: '4.8/5', label: 'Average Rating' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    if ((formData.feedbackType === 'bug' || formData.feedbackType === 'improvement') && !formData.tool) {
      alert('Please select which tool this feedback is about');
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare email content
    const feedbackTypeLabels = {
      'general': 'General Feedback',
      'bug': 'Bug Report',
      'feature': 'Feature Request',
      'improvement': 'Improvement Suggestion'
    };
    
    const emailSubject = `[FreeDevTools Hub] ${feedbackTypeLabels[formData.feedbackType]}: ${formData.subject}`;
    
    let emailBody = `Feedback Details:\n\n`;
    emailBody += `Name: ${formData.name}\n`;
    emailBody += `Email: ${formData.email}\n`;
    emailBody += `Feedback Type: ${feedbackTypeLabels[formData.feedbackType]}\n`;
    
    if (formData.tool) {
      emailBody += `Tool: ${formData.tool}\n`;
    }
    
    if (formData.rating > 0) {
      emailBody += `Rating: ${formData.rating}/5 stars\n`;
    }
    
    emailBody += `Subject: ${formData.subject}\n\n`;
    emailBody += `Message:\n${formData.message}\n\n`;
    emailBody += `---\n`;
    emailBody += `Submitted from: FreeDevTools Hub Feedback Form\n`;
    emailBody += `Date: ${new Date().toLocaleString()}\n`;
    
    // Create mailto URL
    const mailtoUrl = `mailto:nnywwynn88@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    
    // Show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          feedbackType: 'general',
          rating: 0,
          subject: '',
          message: '',
          tool: ''
        });
      }, 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Feedback
              <span className="block text-blue-600">Matters to Us</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Help us improve FreeDevTools Hub by sharing your thoughts, reporting bugs, 
              or suggesting new features. Your input drives our development roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feedback Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Type of Feedback Do You Have?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the category that best describes your feedback to help us prioritize and respond appropriately.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {feedbackTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.feedbackType === type.value;
              return (
                <div
                  key={type.value}
                  onClick={() => setFormData(prev => ({ ...prev, feedbackType: type.value }))}
                  className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-200 ${
                    isSelected 
                      ? `border-${type.color}-500 bg-${type.color}-50` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isSelected ? `bg-${type.color}-500` : `bg-${type.color}-100`
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isSelected ? 'text-white' : `text-${type.color}-600`
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.label}</h3>
                  <div className={`w-4 h-4 rounded-full border-2 ml-auto ${
                    isSelected 
                      ? `border-${type.color}-500 bg-${type.color}-500` 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Share Your Feedback
            </h2>
            <p className="text-lg text-gray-600">
              We read every message and use your feedback to make our tools better.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700 mb-4">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
              </p>
              <p className="text-sm text-green-600">
                We'll review your feedback and get back to you if needed.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Tool Selection (if bug report or improvement) */}
                {(formData.feedbackType === 'bug' || formData.feedbackType === 'improvement') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Which tool is this about?
                    </label>
                    <select
                      name="tool"
                      value={formData.tool}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.feedbackType === 'bug' || formData.feedbackType === 'improvement'}
                    >
                      <option value="">Select a tool</option>
                      {tools.map(tool => (
                        <option key={tool} value={tool}>{tool}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rating (for general feedback) */}
                {formData.feedbackType === 'general' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How would you rate your overall experience?
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className={`p-1 ${
                            star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      formData.feedbackType === 'bug' 
                        ? 'Please describe the bug in detail, including steps to reproduce it...'
                        : formData.feedbackType === 'feature'
                        ? 'Describe the feature you would like to see and how it would help you...'
                        : 'Share your thoughts, suggestions, or any other feedback...'
                    }
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Feedback
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How quickly do you respond to feedback?
              </h3>
              <p className="text-gray-600">
                We typically respond to feedback within 24-48 hours. Bug reports are prioritized and usually addressed within 24 hours.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you implement feature requests?
              </h3>
              <p className="text-gray-600">
                We carefully review all feature requests and implement those that align with our roadmap and would benefit our user community.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my feedback kept confidential?
              </h3>
              <p className="text-gray-600">
                Yes, all feedback is kept confidential. We only use your contact information to respond to your feedback if needed.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I suggest new tools to add?
              </h3>
              <p className="text-gray-600">
                Absolutely! We're always looking to expand our toolkit. Use the feature request option to suggest new developer tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Back to Building?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for helping us improve. Now get back to what you do best – building amazing applications with our developer tools.
          </p>
          <a 
            href="#tools" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
          >
            Back to Tools <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}