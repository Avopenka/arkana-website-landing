import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Master {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise: string[];
  decisionWeight: number;
  responseStyle: 'formal' | 'conversational' | 'analytical' | 'creative' | 'philosophical';
  avatar?: string;
}

interface PricingTier {
  id: string;
  name: string;
  priceCents: number;
  description: string;
  features: string[];
  queryLimit?: number;
}

interface CouncilData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  philosophy: string;
  decisionProcess: string;
  masters: Master[];
  category: string;
  tags: string[];
  targetAudience: string[];
  useCases: string[];
  pricingModel: 'per_query' | 'subscription' | 'tier_based';
  basePriceCents: number;
  pricingTiers: PricingTier[];
  contentRating: 'general' | 'mature' | 'adult';
  visibility: 'public' | 'unlisted' | 'private';
}

interface CouncilCreationWizardProps {
  creatorId: string;
  onComplete: (council: CouncilData) => void;
  onCancel: () => void;
}

export default function CouncilCreationWizard({ creatorId, onComplete, onCancel }: CouncilCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  
  const [councilData, setCouncilData] = useState<CouncilData>({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    philosophy: '',
    decisionProcess: '',
    masters: [],
    category: '',
    tags: [],
    targetAudience: [],
    useCases: [],
    pricingModel: 'per_query',
    basePriceCents: 500, // $5.00 default
    pricingTiers: [],
    contentRating: 'general',
    visibility: 'public'
  });

  const [masterBuilder, setMasterBuilder] = useState<Partial<Master>>({
    name: '',
    role: '',
    personality: '',
    expertise: [],
    decisionWeight: 1,
    responseStyle: 'conversational'
  });

  const steps = [
    { title: 'Basic Information', description: 'Council name and description' },
    { title: 'Masters & Expertise', description: 'Define your council members' },
    { title: 'Philosophy & Process', description: 'How decisions are made' },
    { title: 'Pricing & Access', description: 'Monetization strategy' },
    { title: 'Categories & Discovery', description: 'Help users find your council' },
    { title: 'Review & Launch', description: 'Final review and publish' }
  ];

  useEffect(() => {
    if (councilData.name && currentStep === 1) {
      generateSlug();
    }
  }, [councilData.name]);

  const generateSlug = () => {
    const slug = councilData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    setCouncilData(prev => ({ ...prev, slug }));
  };

  const generateAISuggestions = async (context: string) => {
    setLoading(true);
    try {
      // In production, this would call your AI service
      const response = await fetch('/api/ai/generate-council-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          councilName: councilData.name,
          category: councilData.category,
          currentMasters: councilData.masters
        })
      });

      const suggestions = await response.json();
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback suggestions
      generateFallbackSuggestions(context);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackSuggestions = (context: string) => {
    const suggestions = {
      masters: [
        {
          name: 'Dr. Elena Vasquez',
          role: 'Chief Strategist',
          personality: 'Analytical and detail-oriented with a focus on practical solutions',
          expertise: ['strategic planning', 'data analysis', 'business optimization'],
          responseStyle: 'analytical'
        },
        {
          name: 'Marcus Chen',
          role: 'Innovation Lead',
          personality: 'Creative visionary who thinks outside conventional boundaries',
          expertise: ['innovation', 'creative problem solving', 'future trends'],
          responseStyle: 'creative'
        },
        {
          name: 'Professor Sarah Williams',
          role: 'Wisdom Keeper',
          personality: 'Philosophical and thoughtful with deep industry experience',
          expertise: ['industry knowledge', 'philosophical guidance', 'mentorship'],
          responseStyle: 'philosophical'
        }
      ],
      philosophy: 'We believe in balanced decision-making that combines analytical rigor with creative vision and wisdom from experience.',
      decisionProcess: 'Each master contributes their unique perspective, and we synthesize viewpoints to provide comprehensive guidance.',
      useCases: [
        'Strategic business decisions',
        'Innovation challenges',
        'Long-term planning',
        'Problem-solving guidance'
      ]
    };
    
    setAiSuggestions(suggestions);
  };

  const addMaster = () => {
    if (!masterBuilder.name || !masterBuilder.role) return;

    const master: Master = {
      id: `master_${Date.now()}`,
      name: masterBuilder.name,
      role: masterBuilder.role,
      personality: masterBuilder.personality || '',
      expertise: masterBuilder.expertise || [],
      decisionWeight: masterBuilder.decisionWeight || 1,
      responseStyle: masterBuilder.responseStyle || 'conversational'
    };

    setCouncilData(prev => ({
      ...prev,
      masters: [...prev.masters, master]
    }));

    setMasterBuilder({
      name: '',
      role: '',
      personality: '',
      expertise: [],
      decisionWeight: 1,
      responseStyle: 'conversational'
    });
  };

  const removeMaster = (masterId: string) => {
    setCouncilData(prev => ({
      ...prev,
      masters: prev.masters.filter(m => m.id !== masterId)
    }));
  };

  const applySuggestion = (type: string, suggestion: { name: string; description: string; expertise: string[] }) => {
    switch (type) {
      case 'master':
        setMasterBuilder(suggestion);
        break;
      case 'philosophy':
        setCouncilData(prev => ({ ...prev, philosophy: suggestion }));
        break;
      case 'decisionProcess':
        setCouncilData(prev => ({ ...prev, decisionProcess: suggestion }));
        break;
      case 'useCases':
        setCouncilData(prev => ({ ...prev, useCases: suggestion }));
        break;
    }
  };

  const addPricingTier = () => {
    const newTier: PricingTier = {
      id: `tier_${Date.now()}`,
      name: '',
      priceCents: 1000,
      description: '',
      features: [],
      queryLimit: undefined
    };

    setCouncilData(prev => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, newTier]
    }));
  };

  const updatePricingTier = (tierId: string, updates: Partial<PricingTier>) => {
    setCouncilData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map(tier =>
        tier.id === tierId ? { ...tier, ...updates } : tier
      )
    }));
  };

  const removePricingTier = (tierId: string) => {
    setCouncilData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter(t => t.id !== tierId)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(councilData.name && councilData.description && councilData.slug);
      case 2:
        return councilData.masters.length >= 2; // Minimum 2 masters
      case 3:
        return !!(councilData.philosophy && councilData.decisionProcess);
      case 4:
        return councilData.pricingModel === 'tier_based' 
          ? councilData.pricingTiers.length > 0
          : councilData.basePriceCents > 0;
      case 5:
        return !!(councilData.category && councilData.tags.length > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveCouncil = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/creator/councils', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId,
          ...councilData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save council');
      }

      const savedCouncil = await response.json();
      onComplete(savedCouncil);
    } catch (error) {
      console.error('Error saving council:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Council Name *</label>
          <input
            type="text"
            value={councilData.name}
            onChange={(e) => setCouncilData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., AI Strategy Council"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">URL Slug *</label>
          <div className="flex">
            <span className="bg-white/5 border border-white/20 rounded-l-lg px-4 py-3 text-gray-400">
              arkana.chat/council/
            </span>
            <input
              type="text"
              value={councilData.slug}
              onChange={(e) => setCouncilData(prev => ({ ...prev, slug: e.target.value }))}
              className="flex-1 bg-white/10 border border-white/20 rounded-r-lg px-4 py-3 focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Short Description *</label>
        <textarea
          value={councilData.description}
          onChange={(e) => setCouncilData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="A brief description of what your council does (1-2 sentences)"
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Detailed Description</label>
        <textarea
          value={councilData.longDescription}
          onChange={(e) => setCouncilData(prev => ({ ...prev, longDescription: e.target.value }))}
          placeholder="Provide a detailed explanation of your council's purpose, expertise, and how it helps users"
          rows={6}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">💡 Tips for a Great Description</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Clearly explain who your council is for</li>
          <li>• Highlight the unique expertise you bring</li>
          <li>• Mention specific problems you solve</li>
          <li>• Use language your target audience understands</li>
        </ul>
      </div>
    </div>
  );

  const renderMastersStep = () => (
    <div className="space-y-6">
      {/* AI Suggestions */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Council Builder</h3>
          <button
            onClick={() => generateAISuggestions('masters')}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Get AI Suggestions'}
          </button>
        </div>

        {aiSuggestions?.masters && (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">AI suggested these masters based on your council:</p>
            {aiSuggestions.masters.map((suggestion: { name: string; description: string; expertise: string[] }, index: number) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{suggestion.name}</h4>
                    <p className="text-sm text-gray-300 mb-2">{suggestion.role}</p>
                    <p className="text-sm text-gray-400">{suggestion.personality}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestion.expertise.map((skill: string, skillIndex: number) => (
                        <span key={skillIndex} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => applySuggestion('master', suggestion)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Use This
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Master Builder */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Council Master</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={masterBuilder.name}
            onChange={(e) => setMasterBuilder(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Master Name"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="text"
            value={masterBuilder.role}
            onChange={(e) => setMasterBuilder(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Role/Title"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <select
            value={masterBuilder.responseStyle}
            onChange={(e) => setMasterBuilder(prev => ({ ...prev, responseStyle: e.target.value as any }))}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          >
            <option value="conversational">Conversational</option>
            <option value="formal">Formal</option>
            <option value="analytical">Analytical</option>
            <option value="creative">Creative</option>
            <option value="philosophical">Philosophical</option>
          </select>
          
          <input
            type="number"
            value={masterBuilder.decisionWeight}
            onChange={(e) => setMasterBuilder(prev => ({ ...prev, decisionWeight: parseFloat(e.target.value) || 1 }))}
            placeholder="Decision Weight (1-5)"
            min="1"
            max="5"
            step="0.1"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
        </div>
        
        <textarea
          value={masterBuilder.personality}
          onChange={(e) => setMasterBuilder(prev => ({ ...prev, personality: e.target.value }))}
          placeholder="Personality and approach to decision-making"
          rows={3}
          className="w-full mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <input
          type="text"
          value={masterBuilder.expertise?.join(', ') || ''}
          onChange={(e) => setMasterBuilder(prev => ({ 
            ...prev, 
            expertise: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          }))}
          placeholder="Areas of expertise (comma separated)"
          className="w-full mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <button
          onClick={addMaster}
          className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Add Master
        </button>
      </div>

      {/* Current Masters */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Council Masters ({councilData.masters.length})</h3>
        {councilData.masters.length === 0 && (
          <p className="text-gray-400 text-center py-8">No masters added yet. Add at least 2 masters to continue.</p>
        )}
        
        {councilData.masters.map((master) => (
          <motion.div
            key={master.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold">{master.name}</h4>
                  <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {master.role}
                  </span>
                  <span className="text-sm bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                    {master.responseStyle}
                  </span>
                  <span className="text-sm bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                    Weight: {master.decisionWeight}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{master.personality}</p>
                {master.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {master.expertise.map((skill, index) => (
                      <span key={index} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeMaster(master.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {councilData.masters.length >= 2 && councilData.masters.length < 5 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            ✓ Great! You have {councilData.masters.length} masters. You can add up to 5 total for more diverse perspectives.
          </p>
        </div>
      )}
    </div>
  );

  const renderPhilosophyStep = () => (
    <div className="space-y-6">
      {/* AI Suggestions */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Philosophy & Decision Process</h3>
          <button
            onClick={() => generateAISuggestions('philosophy')}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Get AI Suggestions'}
          </button>
        </div>

        {aiSuggestions?.philosophy && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold mb-2">Suggested Philosophy</h4>
                  <p className="text-gray-300">{aiSuggestions.philosophy}</p>
                </div>
                <button
                  onClick={() => applySuggestion('philosophy', aiSuggestions.philosophy)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Use This
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold mb-2">Suggested Decision Process</h4>
                  <p className="text-gray-300">{aiSuggestions.decisionProcess}</p>
                </div>
                <button
                  onClick={() => applySuggestion('decisionProcess', aiSuggestions.decisionProcess)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Use This
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Council Philosophy *</label>
        <textarea
          value={councilData.philosophy}
          onChange={(e) => setCouncilData(prev => ({ ...prev, philosophy: e.target.value }))}
          placeholder="What principles guide your council's approach to decision-making and advice?"
          rows={4}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Decision-Making Process *</label>
        <textarea
          value={councilData.decisionProcess}
          onChange={(e) => setCouncilData(prev => ({ ...prev, decisionProcess: e.target.value }))}
          placeholder="How do your masters collaborate to reach decisions? What's the process for synthesizing different viewpoints?"
          rows={4}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">💡 Philosophy Guidelines</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Explain your core values and beliefs</li>
          <li>• Describe your approach to complex problems</li>
          <li>• Mention any frameworks or methodologies you use</li>
          <li>• Keep it authentic to your expertise and experience</li>
        </ul>
      </div>
    </div>
  );

  const renderPricingStep = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Pricing Model</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              id: 'per_query',
              title: 'Per Query',
              description: 'Users pay for each question',
              recommended: true
            },
            {
              id: 'subscription',
              title: 'Subscription',
              description: 'Monthly recurring revenue',
              recommended: false
            },
            {
              id: 'tier_based',
              title: 'Tiered Access',
              description: 'Multiple pricing tiers',
              recommended: false
            }
          ].map(model => (
            <div
              key={model.id}
              onClick={() => setCouncilData(prev => ({ ...prev, pricingModel: model.id as any }))}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                councilData.pricingModel === model.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{model.title}</h4>
                {model.recommended && (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300">{model.description}</p>
            </div>
          ))}
        </div>
      </div>

      {councilData.pricingModel === 'per_query' && (
        <div>
          <label className="block text-sm font-medium mb-2">Price per Query</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">$</span>
            <input
              type="number"
              value={councilData.basePriceCents / 100}
              onChange={(e) => setCouncilData(prev => ({ 
                ...prev, 
                basePriceCents: Math.round((parseFloat(e.target.value) || 0) * 100)
              }))}
              min="0.50"
              max="100"
              step="0.50"
              className="w-32 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
            />
            <span className="text-sm text-gray-400">per query</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            You'll receive 70% (${((councilData.basePriceCents * 0.7) / 100).toFixed(2)}) per query
          </p>
        </div>
      )}

      {councilData.pricingModel === 'subscription' && (
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Subscription Price</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">$</span>
            <input
              type="number"
              value={councilData.basePriceCents / 100}
              onChange={(e) => setCouncilData(prev => ({ 
                ...prev, 
                basePriceCents: Math.round((parseFloat(e.target.value) || 0) * 100)
              }))}
              min="5"
              max="500"
              step="5"
              className="w-32 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
            />
            <span className="text-sm text-gray-400">per month</span>
          </div>
        </div>
      )}

      {councilData.pricingModel === 'tier_based' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pricing Tiers</h3>
            <button
              onClick={addPricingTier}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Add Tier
            </button>
          </div>

          {councilData.pricingTiers.map((tier, index) => (
            <div key={tier.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => updatePricingTier(tier.id, { name: e.target.value })}
                  placeholder="Tier Name"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
                />
                
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <input
                    type="number"
                    value={tier.priceCents / 100}
                    onChange={(e) => updatePricingTier(tier.id, { 
                      priceCents: Math.round((parseFloat(e.target.value) || 0) * 100)
                    })}
                    placeholder="Price"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
                  />
                </div>
                
                <input
                  type="number"
                  value={tier.queryLimit || ''}
                  onChange={(e) => updatePricingTier(tier.id, { 
                    queryLimit: parseInt(e.target.value) || undefined
                  })}
                  placeholder="Query Limit"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
                />
                
                <button
                  onClick={() => removePricingTier(tier.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              
              <textarea
                value={tier.description}
                onChange={(e) => updatePricingTier(tier.id, { description: e.target.value })}
                placeholder="Tier description"
                rows={2}
                className="w-full mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">💰 Pricing Tips</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Research similar councils to understand market rates</li>
          <li>• Start with competitive pricing to build reputation</li>
          <li>• You can adjust prices anytime based on demand</li>
          <li>• Quality councils with great reviews can command premium pricing</li>
        </ul>
      </div>
    </div>
  );

  const renderCategoriesStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <select
          value={councilData.category}
          onChange={(e) => setCouncilData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        >
          <option value="">Select Category</option>
          <option value="business">Business Strategy</option>
          <option value="technology">Technology</option>
          <option value="creative">Creative & Design</option>
          <option value="personal">Personal Development</option>
          <option value="health">Health & Wellness</option>
          <option value="finance">Finance & Investment</option>
          <option value="education">Education & Learning</option>
          <option value="relationships">Relationships</option>
          <option value="career">Career Development</option>
          <option value="innovation">Innovation</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags *</label>
        <input
          type="text"
          value={councilData.tags.join(', ')}
          onChange={(e) => setCouncilData(prev => ({ 
            ...prev, 
            tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          }))}
          placeholder="e.g., strategy, AI, business, consulting (comma separated)"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Target Audience</label>
        <input
          type="text"
          value={councilData.targetAudience.join(', ')}
          onChange={(e) => setCouncilData(prev => ({ 
            ...prev, 
            targetAudience: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          }))}
          placeholder="e.g., entrepreneurs, executives, students (comma separated)"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Use Cases</label>
        <textarea
          value={councilData.useCases.join('\n')}
          onChange={(e) => setCouncilData(prev => ({ 
            ...prev, 
            useCases: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
          }))}
          placeholder="Enter each use case on a new line&#10;e.g.,&#10;Strategic business planning&#10;Innovation challenges&#10;Team leadership decisions"
          rows={5}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Content Rating</label>
          <select
            value={councilData.contentRating}
            onChange={(e) => setCouncilData(prev => ({ ...prev, contentRating: e.target.value as any }))}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          >
            <option value="general">General (All Ages)</option>
            <option value="mature">Mature (18+)</option>
            <option value="adult">Adult (21+)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <select
            value={councilData.visibility}
            onChange={(e) => setCouncilData(prev => ({ ...prev, visibility: e.target.value as any }))}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          >
            <option value="public">Public (Listed in marketplace)</option>
            <option value="unlisted">Unlisted (Direct link only)</option>
            <option value="private">Private (Invitation only)</option>
          </select>
        </div>
      </div>

      {aiSuggestions?.useCases && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold mb-2">AI Suggested Use Cases</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {aiSuggestions.useCases.map((useCase: string, index: number) => (
                  <li key={index}>• {useCase}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => applySuggestion('useCases', aiSuggestions.useCases)}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Use These
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Council Summary</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-gray-400">Name</div>
            <div className="font-semibold">{councilData.name}</div>
          </div>
          <div>
            <div className="text-gray-400">Category</div>
            <div className="font-semibold">{councilData.category}</div>
          </div>
          <div>
            <div className="text-gray-400">Masters</div>
            <div className="font-semibold">{councilData.masters.length} masters</div>
          </div>
          <div>
            <div className="text-gray-400">Pricing</div>
            <div className="font-semibold">
              {councilData.pricingModel === 'per_query' && `$${(councilData.basePriceCents / 100).toFixed(2)} per query`}
              {councilData.pricingModel === 'subscription' && `$${(councilData.basePriceCents / 100).toFixed(2)} per month`}
              {councilData.pricingModel === 'tier_based' && `${councilData.pricingTiers.length} tiers`}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Visibility</div>
            <div className="font-semibold capitalize">{councilData.visibility}</div>
          </div>
          <div>
            <div className="text-gray-400">Content Rating</div>
            <div className="font-semibold capitalize">{councilData.contentRating}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-gray-300">{councilData.description}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Masters</h4>
        <div className="space-y-3">
          {councilData.masters.map(master => (
            <div key={master.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{master.name}</span>
                <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {master.role}
                </span>
              </div>
              <p className="text-sm text-gray-300">{master.personality}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">📋 Review Checklist</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>✓ Council information is accurate and complete</li>
          <li>✓ Masters have unique personalities and expertise</li>
          <li>✓ Pricing is competitive and fair</li>
          <li>✓ Description clearly explains your value proposition</li>
          <li>✓ Categories and tags will help users discover your council</li>
        </ul>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">🚀 After Publishing</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Your council will be reviewed within 24 hours</li>
          <li>• Once approved, it will appear in the marketplace</li>
          <li>• You can start earning revenue immediately</li>
          <li>• Monitor performance in your creator dashboard</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold">Create Council</h1>
            <div className="text-sm text-gray-400">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{steps[currentStep - 1].title}</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderBasicInfoStep()}
              {currentStep === 2 && renderMastersStep()}
              {currentStep === 3 && renderPhilosophyStep()}
              {currentStep === 4 && renderPricingStep()}
              {currentStep === 5 && renderCategoriesStep()}
              {currentStep === 6 && renderReviewStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              {currentStep > 1 && (
                <button
                  onClick={previousStep}
                  className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
                >
                  Previous
                </button>
              )}
            </div>
            
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={saveCouncil}
                disabled={loading || !validateStep(currentStep)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-lg hover:from-green-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Council'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}