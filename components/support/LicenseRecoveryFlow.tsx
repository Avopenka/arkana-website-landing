import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Key, Mail, CreditCard, RefreshCw } from 'lucide-react';

interface RecoveryStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: () => Promise<void>;
}

export function LicenseRecoveryFlow() {
  const [activeStep, setActiveStep] = useState<string>('');
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  const recoverySteps: RecoveryStep[] = [
    {
      id: 'seed-phrase',
      title: 'Recover from Seed Phrase',
      description: 'If you have your seed phrase, you can regenerate your license',
      icon: <Key className="w-5 h-5" />,
      action: async () => {
        // Redirect to seed phrase recovery in app
        window.location.href = 'arkana://recover-from-seed';
      }
    },
    {
      id: 'email-lookup',
      title: 'Check Purchase Status',
      description: 'Look up your purchase using your email address',
      icon: <Mail className="w-5 h-5" />,
      action: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/support/check-purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          
          const data = await response.json();
          if (data.found) {
            // Show purchase info without revealing sensitive data
            alert(`Purchase found! Tier: ${data.tier}, Status: ${data.status}`);
          } else {
            alert('No purchase found with this email');
          }
        } catch (error) {
          alert('Error checking purchase status');
        }
        setLoading(false);
      }
    },
    {
      id: 'stripe-portal',
      title: 'Manage Subscription',
      description: 'Access your billing and subscription details',
      icon: <CreditCard className="w-5 h-5" />,
      action: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/support/create-portal-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          
          const { url } = await response.json();
          if (url) {
            window.location.href = url;
          }
        } catch (error) {
          alert('Error accessing billing portal');
        }
        setLoading(false);
      }
    },
    {
      id: 'license-status',
      title: 'Check License Status',
      description: 'Verify if your license is active (need first & last 4 chars)',
      icon: <CheckCircle className="w-5 h-5" />,
      action: async () => {
        if (licenseKey.length < 8) {
          alert('Please enter first and last 4 characters of your license');
          return;
        }
        
        setLoading(true);
        try {
          const response = await fetch('/api/support/check-license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              partialKey: licenseKey.slice(0, 4) + '...' + licenseKey.slice(-4)
            })
          });
          
          const data = await response.json();
          alert(`License Status: ${data.status || 'Not found'}`);
        } catch (error) {
          alert('Error checking license status');
        }
        setLoading(false);
      }
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Account Recovery Options</h2>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> We use a zero-knowledge architecture. 
          Your seed phrase is never sent to our servers and we cannot recover it for you.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {recoverySteps.map((step) => (
          <Card key={step.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="mt-1">{step.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                
                {activeStep === step.id && (
                  <div className="mt-4 space-y-3">
                    {step.id === 'email-lookup' && (
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                    
                    {step.id === 'stripe-portal' && (
                      <Input
                        type="email"
                        placeholder="Enter your purchase email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                    
                    {step.id === 'license-status' && (
                      <Input
                        type="text"
                        placeholder="First 4 and last 4 characters"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        maxLength={8}
                      />
                    )}
                    
                    <Button
                      onClick={step.action}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              {activeStep !== step.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(step.id)}
                >
                  Select
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Still need help?</h3>
        <p className="text-sm text-gray-600 mb-3">
          Our support team can help with payment issues, technical problems, and license activation.
        </p>
        <Button variant="outline" onClick={() => window.location.href = 'mailto:support@arkana.app'}>
          Contact Support
        </Button>
      </div>
    </div>
  );
}