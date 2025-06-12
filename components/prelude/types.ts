export interface WaitlistFormData {
  // Step 1: Philosophical Resonance
  philosophicalResponse?: string
  resonanceType?: 'seamless-flow' | 'deep-focus' | 'intuitive-understanding' | 'other'
  philosophicalResonanceOtherText?: string // For when resonanceType is 'other'
  // Step 2: Contact Information
  email?: string
  firstName?: string
  lastName?: string
  // Step 3: Hardware Profile
  deviceFamily?: string
  chipGeneration?: string
  ramSize?: string
  storageCapacity?: string
  plannedUpgrade?: boolean
  // Step 4: Areas of Interest
  interests?: string[]
  otherInterest?: string
}