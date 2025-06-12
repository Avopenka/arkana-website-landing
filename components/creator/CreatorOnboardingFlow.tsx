import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

interface CreatorProfile {
  id?: string;
  fullName: string;
  displayName: string;
  bio: string;
  profession: string;
  yearsExperience: number;
  specialization: string[];
  website?: string;
  location?: string;
  onboardingStep: number;
  kycStatus: string;
  taxStatus: string;
  stripeAccountId?: string;
  verificationStatus: string;
}

type OnboardingStep = 
  | 'welcome' 
  | 'basic_info' 
  | 'professional_verification' 
  | 'kyc_identity' 
  | 'tax_information' 
  | 'payment_setup' 
  | 'agreement' 
  | 'review' 
  | 'complete';

interface CreatorOnboardingFlowProps {
  onComplete: (profile: CreatorProfile) => void;
}

export default function CreatorOnboardingFlow({ onComplete }: CreatorOnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form Data State
  const [profile, setProfile] = useState<CreatorProfile>({
    fullName: '',
    displayName: '',
    bio: '',
    profession: '',
    yearsExperience: 0,
    specialization: [],
    website: '',
    location: '',
    onboardingStep: 1,
    kycStatus: 'not_started',
    taxStatus: 'not_provided',
    verificationStatus: 'pending'
  });

  // KYC and Identity Verification
  const [identityVerification, setIdentityVerification] = useState({
    documentType: '',
    documentNumber: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: ''
  });

  // Tax Information
  const [taxInfo, setTaxInfo] = useState({
    taxCountry: '',
    taxIdType: '',
    taxId: '',
    businessType: 'individual', // 'individual' or 'business'
    businessName: '',
    businessAddress: ''
  });

  // Professional Verification
  const [professionalInfo, setProfessionalInfo] = useState({
    credentials: [] as any[],
    portfolio: [] as any[],
    references: [] as any[],
    linkedinUrl: '',
    githubUrl: '',
    certifications: [] as any[]
  });

  const steps: { step: OnboardingStep; title: string; description: string }[] = [
    { step: 'welcome', title: 'Welcome to Creator Program', description: 'Join the future of AI wisdom' },
    { step: 'basic_info', title: 'Basic Information', description: 'Tell us about yourself' },
    { step: 'professional_verification', title: 'Professional Verification', description: 'Verify your expertise' },
    { step: 'kyc_identity', title: 'Identity Verification', description: 'Secure identity verification' },
    { step: 'tax_information', title: 'Tax Information', description: 'Required for payments' },
    { step: 'payment_setup', title: 'Payment Setup', description: 'Stripe Connect integration' },
    { step: 'agreement', title: 'Creator Agreement', description: 'Terms and conditions' },
    { step: 'review', title: 'Review & Submit', description: 'Final review' },
    { step: 'complete', title: 'Welcome Aboard!', description: 'You\'re all set' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.step === currentStep);
  const progressPercentage = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingProfile } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        setProfile({
          id: existingProfile.id,
          fullName: existingProfile.full_name || '',
          displayName: existingProfile.display_name || '',
          bio: existingProfile.bio || '',
          profession: existingProfile.profession || '',
          yearsExperience: existingProfile.years_experience || 0,
          specialization: existingProfile.specialization || [],
          website: existingProfile.website_url || '',
          location: existingProfile.location || '',
          onboardingStep: existingProfile.onboarding_step || 1,
          kycStatus: existingProfile.kyc_status || 'not_started',
          taxStatus: existingProfile.tax_status || 'not_provided',
          stripeAccountId: existingProfile.stripe_account_id,
          verificationStatus: existingProfile.verification_status || 'pending'
        });

        // Resume at appropriate step
        const stepMap: { [key: number]: OnboardingStep } = {
          1: 'welcome',
          2: 'basic_info',
          3: 'professional_verification',
          4: 'kyc_identity',
          5: 'tax_information',
          6: 'payment_setup',
          7: 'agreement',
          8: 'review',
          9: 'complete'
        };
        
        setCurrentStep(stepMap[existingProfile.onboarding_step] || 'welcome');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProgress = async (stepNumber: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = {
        user_id: user.id,
        full_name: profile.fullName,
        display_name: profile.displayName,
        bio: profile.bio,
        profession: profile.profession,
        years_experience: profile.yearsExperience,
        specialization: profile.specialization,
        website_url: profile.website,
        location: profile.location,
        onboarding_step: stepNumber,
        kyc_status: profile.kycStatus,
        tax_status: profile.taxStatus,
        verification_status: profile.verificationStatus,
        updated_at: new Date().toISOString()
      };

      if (profile.id) {
        await supabase
          .from('creator_profiles')
          .update(updates)
          .eq('id', profile.id);
      } else {
        const { data } = await supabase
          .from('creator_profiles')
          .insert(updates)
          .select()
          .single();
        
        setProfile(prev => ({ ...prev, id: data.id }));
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const nextStep = async () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      const nextStepIndex = currentIndex + 1;
      const nextStepName = steps[nextStepIndex].step;
      setCurrentStep(nextStepName);
      await saveProgress(nextStepIndex + 1);
    }
  };

  const previousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].step);
    }
  };

  const handleStripeConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.fullName,
          country: taxInfo.taxCountry || 'US',
          business_type: taxInfo.businessType
        })
      });

      const { accountId, onboardingUrl } = await response.json();
      
      // Save Stripe account ID
      setProfile(prev => ({ ...prev, stripeAccountId: accountId }));
      
      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl;
    } catch (error) {
      setError('Failed to set up payment account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initiateKYC = async () => {
    setLoading(true);
    try {
      // In production, integrate with Stripe Identity or Sumsub
      const response = await fetch('/api/kyc/create-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: profile.id,
          personalInfo: identityVerification
        })
      });

      const { verificationUrl } = await response.json();
      
      setProfile(prev => ({ ...prev, kycStatus: 'pending' }));
      
      // In real implementation, redirect to KYC provider
      // window.location.href = verificationUrl;
      
      // For demo, simulate KYC completion
      setTimeout(() => {
        setProfile(prev => ({ ...prev, kycStatus: 'approved' }));
        nextStep();
      }, 2000);
      
    } catch (error) {
      setError('Identity verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitTaxInformation = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('creator_profiles')
        .update({
          tax_country: taxInfo.taxCountry,
          tax_id_type: taxInfo.taxIdType,
          tax_id_last_four: taxInfo.taxId.slice(-4), // Only store last 4 digits
          tax_status: 'verified'
        })
        .eq('user_id', user.id);

      setProfile(prev => ({ ...prev, taxStatus: 'verified' }));
      nextStep();
    } catch (error) {
      setError('Failed to save tax information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('creator_profiles')
        .update({
          onboarding_completed: true,
          status: 'pending_review',
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted: true,
          privacy_accepted_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setCurrentStep('complete');
      setTimeout(() => {
        onComplete(profile);
      }, 3000);
    } catch (error) {
      setError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">🧠</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Join the Creator Program
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Build custom AI councils and earn revenue from your expertise. 
          Share your knowledge with the world through intelligent AI systems.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-3xl mb-4">💰</div>
          <h3 className="text-lg font-semibold mb-2">Earn Revenue</h3>
          <p className="text-gray-400">70% revenue share on all council interactions</p>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Share Expertise</h3>
          <p className="text-gray-400">Create AI councils based on your knowledge</p>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-3xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
          <p className="text-gray-400">Connect with users worldwide</p>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all transform hover:scale-105"
      >
        Start Application
      </button>
    </motion.div>
  );

  const renderBasicInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6">Basic Information</h2>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Display Name *</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="@username"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Professional Bio *</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            placeholder="Describe your expertise and background..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Profession *</label>
            <select
              value={profile.profession}
              onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="">Select Profession</option>
              <option value="AI Researcher">AI Researcher</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Business Consultant">Business Consultant</option>
              <option value="Academic Professor">Academic Professor</option>
              <option value="Life Coach">Life Coach</option>
              <option value="Therapist">Therapist</option>
              <option value="Financial Advisor">Financial Advisor</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience *</label>
            <input
              type="number"
              value={profile.yearsExperience}
              onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
              min="0"
              max="50"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Website (Optional)</label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourwebsite.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderKYCStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6">Identity Verification</h2>
      <p className="text-gray-300 mb-8">
        We need to verify your identity for security and compliance. This is required for all creators.
      </p>

      {profile.kycStatus === 'not_started' && (
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">What you'll need:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Government-issued photo ID (passport, driver's license)</li>
              <li>• Proof of address (utility bill, bank statement)</li>
              <li>• Phone number for verification</li>
              <li>• 5-10 minutes to complete</li>
            </ul>
          </div>

          <button
            onClick={initiateKYC}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Starting Verification...' : 'Begin Identity Verification'}
          </button>
        </div>
      )}

      {profile.kycStatus === 'pending' && (
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Verification in Progress</h3>
          <p className="text-gray-300">Please wait while we verify your identity...</p>
        </div>
      )}

      {profile.kycStatus === 'approved' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="text-xl font-semibold text-green-400 mb-2">Identity Verified!</h3>
          <p className="text-gray-300">Your identity has been successfully verified.</p>
        </div>
      )}
    </motion.div>
  );

  const renderTaxInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6">Tax Information</h2>
      <p className="text-gray-300 mb-8">
        Required for payment processing and tax compliance. Your tax information is encrypted and secure.
      </p>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tax Country *</label>
            <select
              value={taxInfo.taxCountry}
              onChange={(e) => setTaxInfo(prev => ({ ...prev, taxCountry: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Business Type *</label>
            <select
              value={taxInfo.businessType}
              onChange={(e) => setTaxInfo(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tax ID Type *</label>
            <select
              value={taxInfo.taxIdType}
              onChange={(e) => setTaxInfo(prev => ({ ...prev, taxIdType: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="">Select Type</option>
              {taxInfo.taxCountry === 'US' && (
                <>
                  <option value="ssn">Social Security Number</option>
                  <option value="ein">Employer Identification Number</option>
                  <option value="itin">Individual Taxpayer Identification Number</option>
                </>
              )}
              {taxInfo.taxCountry === 'CA' && (
                <>
                  <option value="sin">Social Insurance Number</option>
                  <option value="bn">Business Number</option>
                </>
              )}
              {taxInfo.taxCountry !== 'US' && taxInfo.taxCountry !== 'CA' && (
                <>
                  <option value="vat">VAT Number</option>
                  <option value="tax_id">National Tax ID</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tax ID *</label>
            <input
              type="text"
              value={taxInfo.taxId}
              onChange={(e) => setTaxInfo(prev => ({ ...prev, taxId: e.target.value }))}
              placeholder="Enter your tax ID"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        {taxInfo.businessType === 'business' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name *</label>
              <input
                type="text"
                value={taxInfo.businessName}
                onChange={(e) => setTaxInfo(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Business Address *</label>
              <textarea
                value={taxInfo.businessAddress}
                onChange={(e) => setTaxInfo(prev => ({ ...prev, businessAddress: e.target.value }))}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
          </div>
        )}

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-200">
            <strong>Security Note:</strong> Your tax information is encrypted and stored securely. 
            Only the last 4 digits of your tax ID are retained in our systems.
          </p>
        </div>

        <button
          onClick={submitTaxInformation}
          disabled={loading || !taxInfo.taxCountry || !taxInfo.taxIdType || !taxInfo.taxId}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Tax Information'}
        </button>
      </div>
    </motion.div>
  );

  const renderPaymentSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6">Payment Setup</h2>
      <p className="text-gray-300 mb-8">
        Connect your bank account to receive payments. We use Stripe Connect for secure, fast payments.
      </p>

      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Share</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">70%</div>
              <div className="text-sm text-gray-400">Your Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">30%</div>
              <div className="text-sm text-gray-400">Platform Fee</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">What you'll need:</h3>
          <ul className="space-y-1 text-gray-300">
            <li>• Bank account information</li>
            <li>• Government-issued ID</li>
            <li>• Business information (if applicable)</li>
          </ul>
        </div>

        {!profile.stripeAccountId ? (
          <button
            onClick={handleStripeConnect}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Connect Bank Account'}
          </button>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Payment Account Connected!</h3>
            <p className="text-gray-300">You're ready to receive payments.</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderReviewStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6">Review & Submit</h2>
      <p className="text-gray-300 mb-8">
        Please review your information before submitting your creator application.
      </p>

      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Full Name</div>
              <div>{profile.fullName}</div>
            </div>
            <div>
              <div className="text-gray-400">Display Name</div>
              <div>@{profile.displayName}</div>
            </div>
            <div>
              <div className="text-gray-400">Profession</div>
              <div>{profile.profession}</div>
            </div>
            <div>
              <div className="text-gray-400">Experience</div>
              <div>{profile.yearsExperience} years</div>
            </div>
            <div>
              <div className="text-gray-400">Identity Status</div>
              <div className={`font-semibold ${
                profile.kycStatus === 'approved' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {profile.kycStatus === 'approved' ? 'Verified' : 'Pending'}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Tax Status</div>
              <div className={`font-semibold ${
                profile.taxStatus === 'verified' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {profile.taxStatus === 'verified' ? 'Complete' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Creator Agreement</h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" required />
              <div>
                I agree to the Creator Terms of Service and understand that I will receive 70% of revenue generated from my councils.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" required />
              <div>
                I certify that all information provided is accurate and I have the right to create AI councils based on my expertise.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" required />
              <div>
                I understand that my councils will be reviewed for quality and compliance before being published.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={completeOnboarding}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting Application...' : 'Submit Creator Application'}
        </button>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">Welcome to the Creator Program!</h2>
        <p className="text-xl text-gray-300 mb-8">
          Your application has been submitted successfully. We'll review it within 24-48 hours.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <span className="text-purple-400">1.</span>
            <span>We'll review your application and verify all information</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-400">2.</span>
            <span>You'll receive an email with your approval status</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-400">3.</span>
            <span>Once approved, you can start creating your first council</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-400">4.</span>
            <span>Begin earning revenue from day one</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/creator/dashboard')}
        className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all transform hover:scale-105"
      >
        Go to Creator Dashboard
      </button>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome': return renderWelcomeStep();
      case 'basic_info': return renderBasicInfoStep();
      case 'kyc_identity': return renderKYCStep();
      case 'tax_information': return renderTaxInfoStep();
      case 'payment_setup': return renderPaymentSetupStep();
      case 'review': return renderReviewStep();
      case 'complete': return renderCompleteStep();
      default: return renderBasicInfoStep();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      {currentStep !== 'complete' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold">Creator Onboarding</h1>
              <div className="text-sm text-gray-400">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${currentStep !== 'complete' ? 'pt-24' : ''} pb-12 px-6`}>
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep !== 'welcome' && currentStep !== 'complete' && (
            <div className="flex justify-between mt-12">
              <button
                onClick={previousStep}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
              >
                Previous
              </button>
              
              {currentStep !== 'review' && currentStep !== 'kyc_identity' && currentStep !== 'tax_information' && currentStep !== 'payment_setup' && (
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}