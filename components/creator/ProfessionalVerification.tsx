import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Credential {
  id: string;
  type: 'degree' | 'certification' | 'license' | 'award' | 'publication';
  title: string;
  institution: string;
  date: string;
  description?: string;
  verificationUrl?: string;
  documentUrl?: string;
  verified: boolean;
}

interface Portfolio {
  id: string;
  type: 'project' | 'article' | 'video' | 'presentation' | 'case_study';
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  date: string;
  skills: string[];
}

interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  relationship: string;
  status: 'pending' | 'contacted' | 'verified' | 'declined';
  response?: string;
}

interface ProfessionalVerificationProps {
  creatorId: string;
  onComplete: (data: unknown) => void;
}

export default function ProfessionalVerification({ creatorId, onComplete }: ProfessionalVerificationProps) {
  const [activeTab, setActiveTab] = useState<'credentials' | 'portfolio' | 'references'>('credentials');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State for each section
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  
  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    blog: ''
  });

  // Form states
  const [newCredential, setNewCredential] = useState<Partial<Credential>>({
    type: 'degree',
    title: '',
    institution: '',
    date: '',
    description: '',
    verificationUrl: ''
  });

  const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<Portfolio>>({
    type: 'project',
    title: '',
    description: '',
    url: '',
    date: '',
    skills: []
  });

  const [newReference, setNewReference] = useState<Partial<Reference>>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    relationship: ''
  });

  useEffect(() => {
    loadExistingData();
  }, [creatorId]);

  const loadExistingData = async () => {
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('creator_profiles')
        .select('credentials, verification_documents')
        .eq('id', creatorId)
        .single();

      if (profile?.credentials) {
        setCredentials(profile.credentials || []);
      }

      if (profile?.verification_documents?.portfolio) {
        setPortfolio(profile.verification_documents.portfolio || []);
      }

      if (profile?.verification_documents?.references) {
        setReferences(profile.verification_documents.references || []);
      }

      if (profile?.verification_documents?.social_links) {
        setSocialLinks(profile.verification_documents.social_links || {});
      }
    } catch (error) {
      console.error('Error loading verification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      const verificationData = {
        credentials,
        portfolio,
        references,
        social_links: socialLinks,
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('creator_profiles')
        .update({
          credentials,
          verification_documents: verificationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', creatorId);

      onComplete(verificationData);
    } catch (error) {
      console.error('Error saving verification data:', error);
    } finally {
      setSaving(false);
    }
  };

  const addCredential = () => {
    if (!newCredential.title || !newCredential.institution) return;

    const credential: Credential = {
      id: `cred_${Date.now()}`,
      type: newCredential.type as any,
      title: newCredential.title,
      institution: newCredential.institution,
      date: newCredential.date || '',
      description: newCredential.description || '',
      verificationUrl: newCredential.verificationUrl || '',
      verified: false
    };

    setCredentials([...credentials, credential]);
    setNewCredential({
      type: 'degree',
      title: '',
      institution: '',
      date: '',
      description: '',
      verificationUrl: ''
    });
  };

  const removeCredential = (id: string) => {
    setCredentials(credentials.filter(c => c.id !== id));
  };

  const addPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.description) return;

    const item: Portfolio = {
      id: `port_${Date.now()}`,
      type: newPortfolioItem.type as any,
      title: newPortfolioItem.title,
      description: newPortfolioItem.description,
      url: newPortfolioItem.url || '',
      date: newPortfolioItem.date || new Date().toISOString().split('T')[0],
      skills: newPortfolioItem.skills || []
    };

    setPortfolio([...portfolio, item]);
    setNewPortfolioItem({
      type: 'project',
      title: '',
      description: '',
      url: '',
      date: '',
      skills: []
    });
  };

  const removePortfolioItem = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
  };

  const addReference = () => {
    if (!newReference.name || !newReference.email || !newReference.company) return;

    const reference: Reference = {
      id: `ref_${Date.now()}`,
      name: newReference.name,
      title: newReference.title || '',
      company: newReference.company,
      email: newReference.email,
      phone: newReference.phone || '',
      relationship: newReference.relationship || '',
      status: 'pending'
    };

    setReferences([...references, reference]);
    setNewReference({
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    });
  };

  const removeReference = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
  };

  const contactReference = async (referenceId: string) => {
    // In production, this would send an email to the reference
    console.log('Contacting reference:', referenceId);
    
    setReferences(refs => refs.map(ref => 
      ref.id === referenceId 
        ? { ...ref, status: 'contacted' }
        : ref
    ));
  };

  const renderCredentialsTab = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Credential</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={newCredential.type}
            onChange={(e) => setNewCredential({...newCredential, type: e.target.value as any})}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          >
            <option value="degree">Degree</option>
            <option value="certification">Certification</option>
            <option value="license">License</option>
            <option value="award">Award</option>
            <option value="publication">Publication</option>
          </select>
          
          <input
            type="text"
            value={newCredential.title}
            onChange={(e) => setNewCredential({...newCredential, title: e.target.value})}
            placeholder="Title/Name"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="text"
            value={newCredential.institution}
            onChange={(e) => setNewCredential({...newCredential, institution: e.target.value})}
            placeholder="Institution/Organization"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="date"
            value={newCredential.date}
            onChange={(e) => setNewCredential({...newCredential, date: e.target.value})}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="url"
            value={newCredential.verificationUrl}
            onChange={(e) => setNewCredential({...newCredential, verificationUrl: e.target.value})}
            placeholder="Verification URL (optional)"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
        </div>
        
        <textarea
          value={newCredential.description}
          onChange={(e) => setNewCredential({...newCredential, description: e.target.value})}
          placeholder="Description (optional)"
          rows={3}
          className="w-full mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <button
          onClick={addCredential}
          className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Add Credential
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Credentials ({credentials.length})</h3>
        {credentials.map((credential) => (
          <motion.div
            key={credential.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold">{credential.title}</span>
                  <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {credential.type}
                  </span>
                  {credential.verified && (
                    <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-1">{credential.institution}</p>
                {credential.date && (
                  <p className="text-sm text-gray-400 mb-2">{credential.date}</p>
                )}
                {credential.description && (
                  <p className="text-sm text-gray-300 mb-2">{credential.description}</p>
                )}
                {credential.verificationUrl && (
                  <a
                    href={credential.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    Verification Link →
                  </a>
                )}
              </div>
              <button
                onClick={() => removeCredential(credential.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Portfolio Item</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={newPortfolioItem.type}
            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, type: e.target.value as any})}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          >
            <option value="project">Project</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="presentation">Presentation</option>
            <option value="case_study">Case Study</option>
          </select>
          
          <input
            type="text"
            value={newPortfolioItem.title}
            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
            placeholder="Title"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="url"
            value={newPortfolioItem.url}
            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, url: e.target.value})}
            placeholder="URL (optional)"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="date"
            value={newPortfolioItem.date}
            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, date: e.target.value})}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
        </div>
        
        <textarea
          value={newPortfolioItem.description}
          onChange={(e) => setNewPortfolioItem({...newPortfolioItem, description: e.target.value})}
          placeholder="Description"
          rows={3}
          className="w-full mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <input
          type="text"
          value={newPortfolioItem.skills?.join(', ') || ''}
          onChange={(e) => setNewPortfolioItem({
            ...newPortfolioItem, 
            skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
          placeholder="Skills/Technologies (comma separated)"
          className="w-full mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <button
          onClick={addPortfolioItem}
          className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Add Portfolio Item
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Portfolio ({portfolio.length})</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {portfolio.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                  {item.type}
                </span>
                <button
                  onClick={() => removePortfolioItem(item.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-300 text-sm mb-3">{item.description}</p>
              
              {item.skills && item.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{item.date}</span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    View →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Professional Reference</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newReference.name}
            onChange={(e) => setNewReference({...newReference, name: e.target.value})}
            placeholder="Full Name"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="text"
            value={newReference.title}
            onChange={(e) => setNewReference({...newReference, title: e.target.value})}
            placeholder="Job Title"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="text"
            value={newReference.company}
            onChange={(e) => setNewReference({...newReference, company: e.target.value})}
            placeholder="Company"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="email"
            value={newReference.email}
            onChange={(e) => setNewReference({...newReference, email: e.target.value})}
            placeholder="Email"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="tel"
            value={newReference.phone}
            onChange={(e) => setNewReference({...newReference, phone: e.target.value})}
            placeholder="Phone (optional)"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
          
          <input
            type="text"
            value={newReference.relationship}
            onChange={(e) => setNewReference({...newReference, relationship: e.target.value})}
            placeholder="Relationship (e.g., Former Manager)"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
          />
        </div>
        
        <button
          onClick={addReference}
          className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Add Reference
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your References ({references.length})</h3>
        {references.map((reference) => (
          <motion.div
            key={reference.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold">{reference.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    reference.status === 'verified' ? 'bg-green-500/20 text-green-300' :
                    reference.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-300' :
                    reference.status === 'declined' ? 'bg-red-500/20 text-red-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {reference.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-1">{reference.title} at {reference.company}</p>
                <p className="text-sm text-gray-400 mb-2">{reference.relationship}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{reference.email}</span>
                  {reference.phone && <span>{reference.phone}</span>}
                </div>
                {reference.response && (
                  <div className="mt-3 p-3 bg-white/5 rounded border-l-2 border-green-500">
                    <p className="text-sm text-gray-300">{reference.response}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {reference.status === 'pending' && (
                  <button
                    onClick={() => contactReference(reference.id)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Contact
                  </button>
                )}
                <button
                  onClick={() => removeReference(reference.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSocialLinksSection = () => (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Professional Links</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="url"
          value={socialLinks.linkedin}
          onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
          placeholder="LinkedIn Profile"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <input
          type="url"
          value={socialLinks.github}
          onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
          placeholder="GitHub Profile (if applicable)"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <input
          type="url"
          value={socialLinks.website}
          onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
          placeholder="Personal Website"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
        
        <input
          type="url"
          value={socialLinks.blog}
          onChange={(e) => setSocialLinks({...socialLinks, blog: e.target.value})}
          placeholder="Professional Blog"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:border-purple-500"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Professional Verification</h2>
        <p className="text-gray-300">
          Showcase your expertise with credentials, portfolio, and professional references.
        </p>
      </div>

      {renderSocialLinksSection()}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-white/5 p-2 rounded-lg">
        {[
          { id: 'credentials', label: 'Credentials', count: credentials.length },
          { id: 'portfolio', label: 'Portfolio', count: portfolio.length },
          { id: 'references', label: 'References', count: references.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500 text-white'
                : 'hover:bg-white/10'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'credentials' && renderCredentialsTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'references' && renderReferencesTab()}
        </motion.div>
      </AnimatePresence>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveData}
          disabled={saving}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Professional Information'}
        </button>
      </div>

      {/* Verification Status */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Verification Process</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Credentials will be automatically verified when possible</p>
          <p>• Portfolio items help demonstrate your expertise</p>
          <p>• References may be contacted during the review process</p>
          <p>• Verification typically takes 24-48 hours</p>
        </div>
      </div>
    </div>
  );
}