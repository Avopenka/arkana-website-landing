export const typeDefs = `#graphql
  scalar DateTime
  scalar JSON

  type Query {
    # Creator Queries
    creatorProfile(id: ID!): CreatorProfile
    creatorProjects(
      creatorId: ID!
      status: ProjectStatus
      category: String
      limit: Int = 10
      offset: Int = 0
    ): ProjectConnection
    
    # Project Queries
    project(id: ID!): Project
    projectTasks(projectId: ID!, status: TaskStatus): [Task]
    projectCollaborations(projectId: ID!): [Collaboration]
    
    # Asset Queries
    creatorAssets(
      creatorId: ID!
      assetType: AssetType
      projectId: ID
      limit: Int = 20
      offset: Int = 0
    ): AssetConnection
    
    # Analytics Queries
    creatorAnalytics(
      creatorId: ID!
      period: AnalyticsPeriod!
      metrics: [String]
    ): CreatorAnalytics
    
    # Revenue Queries
    revenueStreams(
      creatorId: ID!
      streamType: RevenueStreamType
      status: RevenueStatus
      startDate: DateTime
      endDate: DateTime
    ): [RevenueStream]
    
    # Content Queries
    creatorContent(
      creatorId: ID!
      status: ContentStatus
      contentType: ContentType
    ): [Content]
    
    # Search Queries
    searchCreators(query: String!, limit: Int = 10): [CreatorProfile]
    searchProjects(query: String!, limit: Int = 10): [Project]
  }

  type Mutation {
    # Creator Mutations
    updateCreatorProfile(input: UpdateCreatorProfileInput!): CreatorProfile
    
    # Project Mutations
    createProject(input: CreateProjectInput!): Project
    updateProject(id: ID!, input: UpdateProjectInput!): Project
    deleteProject(id: ID!): Boolean
    
    # Task Mutations
    createTask(input: CreateTaskInput!): Task
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean
    
    # Collaboration Mutations
    inviteCollaborator(input: InviteCollaboratorInput!): Collaboration
    respondToInvitation(id: ID!, response: InvitationResponse!): Collaboration
    updateCollaboration(id: ID!, input: UpdateCollaborationInput!): Collaboration
    
    # Asset Mutations
    uploadAsset(input: UploadAssetInput!): Asset
    updateAsset(id: ID!, input: UpdateAssetInput!): Asset
    deleteAsset(id: ID!): Boolean
    
    # Revenue Mutations
    createRevenueStream(input: CreateRevenueStreamInput!): RevenueStream
    updateRevenueStream(id: ID!, input: UpdateRevenueStreamInput!): RevenueStream
    
    # Content Mutations
    createContent(input: CreateContentInput!): Content
    updateContent(id: ID!, input: UpdateContentInput!): Content
    publishContent(id: ID!): Content
    
    # Integration Mutations
    connectIntegration(input: ConnectIntegrationInput!): Integration
    syncIntegration(id: ID!): IntegrationSyncResult
    disconnectIntegration(id: ID!): Boolean
  }

  type Subscription {
    # Real-time collaboration
    projectUpdated(projectId: ID!): Project
    taskUpdated(projectId: ID!): Task
    collaborationUpdated(projectId: ID!): Collaboration
    
    # Live notifications
    notificationReceived(creatorId: ID!): Notification
    
    # Asset processing
    assetProcessingUpdated(assetId: ID!): Asset
    
    # Revenue updates
    revenueStreamUpdated(creatorId: ID!): RevenueStream
  }

  # Core Types
  type CreatorProfile {
    id: ID!
    userId: ID!
    fullName: String!
    displayName: String!
    avatarUrl: String
    coverImageUrl: String
    bio: String
    tagline: String
    profession: String!
    specialization: [String!]!
    yearsExperience: Int
    location: String
    websiteUrl: String
    portfolioUrls: [String!]!
    status: CreatorStatus!
    verificationStatus: VerificationStatus!
    creatorTier: CreatorTier!
    onboardingCompleted: Boolean!
    
    # Stats
    totalProjects: Int!
    totalRevenue: Float!
    totalCollaborators: Int!
    followerCount: Int!
    
    # Settings
    privacySettings: JSON!
    notificationSettings: JSON!
    collaborationSettings: JSON!
    
    # Relations
    projects(status: ProjectStatus, limit: Int): [Project!]!
    skills: [CreatorSkill!]!
    socialLinks: [CreatorSocialLink!]!
    collaborations: [Collaboration!]!
    
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Project {
    id: ID!
    creatorId: ID!
    title: String!
    description: String
    shortDescription: String
    projectType: ProjectType!
    category: String!
    tags: [String!]!
    status: ProjectStatus!
    visibility: ProjectVisibility!
    featured: Boolean!
    
    # Media
    coverImageUrl: String
    galleryUrls: [String!]!
    demoUrl: String
    repositoryUrl: String
    
    # Progress
    progressPercentage: Int!
    milestonesCompleted: Int!
    totalMilestones: Int!
    
    # Pricing
    pricingModel: PricingModel
    basePrice: Float
    hourlyRate: Float
    revenueGenerated: Float!
    
    # Team
    teamSize: Int!
    maxCollaborators: Int!
    collaborationType: CollaborationType!
    
    # Timing
    estimatedDuration: String
    actualDuration: String
    startedAt: DateTime
    deadlineAt: DateTime
    completedAt: DateTime
    
    # Relations
    creator: CreatorProfile!
    collaborations: [Collaboration!]!
    milestones: [Milestone!]!
    tasks: [Task!]!
    assets: [Asset!]!
    
    # Metadata
    projectData: JSON!
    customFields: JSON!
    
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Collaboration {
    id: ID!
    projectId: ID!
    collaboratorId: ID!
    inviterId: ID
    role: CollaborationRole!
    permissions: [String!]!
    status: CollaborationStatus!
    
    # Compensation
    compensationType: CompensationType
    compensationAmount: Float
    revenueSharePercentage: Float
    
    # Details
    responsibilities: [String!]!
    accessLevel: AccessLevel!
    
    # Legal
    ndaSigned: Boolean!
    contractSigned: Boolean!
    
    # Relations
    project: Project!
    collaborator: CreatorProfile!
    inviter: CreatorProfile
    
    invitedAt: DateTime!
    joinedAt: DateTime
    leftAt: DateTime
    createdAt: DateTime!
  }

  type Task {
    id: ID!
    projectId: ID!
    milestoneId: ID
    assignedTo: ID
    title: String!
    description: String
    taskType: TaskType!
    priority: TaskPriority!
    status: TaskStatus!
    
    # Time tracking
    estimatedHours: Float
    actualHours: Float!
    dueDate: DateTime
    
    # Dependencies
    dependencies: [ID!]!
    
    # Relations
    project: Project!
    milestone: Milestone
    assignee: CreatorProfile
    
    # Metadata
    taskData: JSON!
    
    completedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Asset {
    id: ID!
    creatorId: ID!
    projectId: ID
    filename: String!
    originalFilename: String!
    filePath: String!
    fileSize: Int!
    fileType: String!
    mimeType: String!
    assetType: AssetType!
    category: String
    tags: [String!]!
    
    # Media metadata
    dimensions: JSON
    duration: Int
    colorPalette: [String!]!
    
    # Versioning
    versionNumber: Int!
    parentAssetId: ID
    
    # Status
    status: AssetStatus!
    visibility: AssetVisibility!
    
    # Rights
    licenseType: LicenseType!
    copyrightHolder: String
    
    # Processing
    processingStatus: ProcessingStatus!
    thumbnailUrl: String
    previewUrl: String
    cdnUrl: String
    compressedUrl: String
    
    # Relations
    creator: CreatorProfile!
    project: Project
    
    # Metadata
    metadata: JSON!
    
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type RevenueStream {
    id: ID!
    creatorId: ID!
    projectId: ID
    streamType: RevenueStreamType!
    source: String!
    amount: Float!
    currency: String!
    status: RevenueStatus!
    
    # Payment details
    paymentMethod: String
    transactionId: String
    stripePaymentIntentId: String
    
    # Fees
    platformFee: Float!
    processingFee: Float!
    netAmount: Float!
    
    # Timing
    earnedAt: DateTime!
    paidAt: DateTime
    
    # Relations
    creator: CreatorProfile!
    project: Project
    
    # Metadata
    description: String
    invoiceUrl: String
    receiptUrl: String
    metadata: JSON!
    
    createdAt: DateTime!
  }

  type Content {
    id: ID!
    creatorId: ID!
    projectId: ID
    title: String!
    content: String!
    excerpt: String
    contentType: ContentType!
    format: ContentFormat!
    
    # Media
    featuredImageUrl: String
    galleryUrls: [String!]!
    videoUrl: String
    
    # SEO
    slug: String!
    metaTitle: String
    metaDescription: String
    keywords: [String!]!
    
    # Publishing
    status: ContentStatus!
    visibility: ContentVisibility!
    publishedAt: DateTime
    scheduledFor: DateTime
    
    # Engagement
    viewCount: Int!
    likeCount: Int!
    commentCount: Int!
    shareCount: Int!
    
    # Structure
    tableOfContents: JSON
    readingTime: Int
    difficultyLevel: Int
    
    # Monetization
    isPremium: Boolean!
    price: Float
    accessType: AccessType!
    
    # Relations
    creator: CreatorProfile!
    project: Project
    
    # Metadata
    metadata: JSON!
    
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Enums
  enum CreatorStatus {
    PENDING_REVIEW
    ACTIVE
    SUSPENDED
    INACTIVE
  }

  enum VerificationStatus {
    UNVERIFIED
    PENDING
    VERIFIED
    REJECTED
  }

  enum CreatorTier {
    STARTER
    PRO
    ENTERPRISE
    LEGEND
  }

  enum ProjectStatus {
    DRAFT
    ACTIVE
    COMPLETED
    ARCHIVED
    CANCELLED
  }

  enum ProjectType {
    CONTENT
    DESIGN
    DEVELOPMENT
    MARKETING
    CONSULTING
    OTHER
  }

  enum ProjectVisibility {
    PRIVATE
    TEAM
    PUBLIC
    UNLISTED
  }

  enum PricingModel {
    FIXED
    HOURLY
    SUBSCRIPTION
    COMMISSION
    FREE
  }

  enum CollaborationType {
    INVITATION_ONLY
    OPEN
    APPLICATION_BASED
  }

  enum CollaborationRole {
    OWNER
    ADMIN
    EDITOR
    VIEWER
    CONTRIBUTOR
  }

  enum CollaborationStatus {
    PENDING
    ACTIVE
    DECLINED
    REMOVED
  }

  enum CompensationType {
    NONE
    REVENUE_SHARE
    FIXED_FEE
    HOURLY
  }

  enum AccessLevel {
    LIMITED
    STANDARD
    FULL
  }

  enum TaskType {
    GENERAL
    DESIGN
    DEVELOPMENT
    CONTENT
    REVIEW
    TESTING
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    REVIEW
    COMPLETED
    BLOCKED
  }

  enum AssetType {
    IMAGE
    VIDEO
    AUDIO
    DOCUMENT
    ARCHIVE
    MODEL
    FONT
    OTHER
  }

  enum AssetStatus {
    ACTIVE
    ARCHIVED
    DELETED
  }

  enum AssetVisibility {
    PRIVATE
    TEAM
    PUBLIC
  }

  enum LicenseType {
    PRIVATE
    CC0
    CC_BY
    CC_BY_SA
    COMMERCIAL
  }

  enum ProcessingStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  enum RevenueStreamType {
    PROJECT_PAYMENT
    SUBSCRIPTION
    COMMISSION
    LICENSING
    TIP
    AFFILIATE
  }

  enum RevenueStatus {
    PENDING
    CONFIRMED
    PAID
    DISPUTED
    REFUNDED
  }

  enum ContentType {
    ARTICLE
    TUTORIAL
    CASE_STUDY
    PORTFOLIO_PIECE
    ANNOUNCEMENT
  }

  enum ContentFormat {
    MARKDOWN
    HTML
    RICH_TEXT
  }

  enum ContentStatus {
    DRAFT
    PUBLISHED
    SCHEDULED
    ARCHIVED
  }

  enum ContentVisibility {
    PRIVATE
    PUBLIC
    PREMIUM
    TEAM_ONLY
  }

  enum AccessType {
    FREE
    PREMIUM
    SUBSCRIBER_ONLY
  }

  enum AnalyticsPeriod {
    SEVEN_DAYS
    THIRTY_DAYS
    NINETY_DAYS
    ONE_YEAR
  }

  enum InvitationResponse {
    ACCEPT
    DECLINE
  }

  # Input Types
  input CreateProjectInput {
    title: String!
    description: String
    shortDescription: String
    projectType: ProjectType!
    category: String!
    tags: [String!] = []
    visibility: ProjectVisibility = PRIVATE
    pricingModel: PricingModel
    basePrice: Float
    hourlyRate: Float
    estimatedDuration: String
    maxCollaborators: Int = 5
    collaborationType: CollaborationType = INVITATION_ONLY
  }

  input UpdateProjectInput {
    title: String
    description: String
    shortDescription: String
    category: String
    tags: [String!]
    visibility: ProjectVisibility
    status: ProjectStatus
    coverImageUrl: String
    demoUrl: String
    repositoryUrl: String
    progressPercentage: Int
    deadlineAt: DateTime
  }

  input CreateTaskInput {
    projectId: ID!
    milestoneId: ID
    assignedTo: ID
    title: String!
    description: String
    taskType: TaskType = GENERAL
    priority: TaskPriority = MEDIUM
    estimatedHours: Float
    dueDate: DateTime
    dependencies: [ID!] = []
  }

  input UpdateTaskInput {
    title: String
    description: String
    taskType: TaskType
    priority: TaskPriority
    status: TaskStatus
    estimatedHours: Float
    actualHours: Float
    dueDate: DateTime
    assignedTo: ID
  }

  input InviteCollaboratorInput {
    projectId: ID!
    collaboratorEmail: String!
    role: CollaborationRole = CONTRIBUTOR
    responsibilities: [String!] = []
    compensationType: CompensationType = NONE
    compensationAmount: Float
    revenueSharePercentage: Float
    message: String
  }

  # Connection Types for Pagination
  type ProjectConnection {
    nodes: [Project!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type AssetConnection {
    nodes: [Asset!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Analytics Types
  type CreatorAnalytics {
    period: AnalyticsPeriod!
    dateRange: DateRange!
    overview: AnalyticsOverview!
    projects: ProjectAnalytics!
    revenue: RevenueAnalytics!
    collaborations: CollaborationAnalytics!
    assets: AssetAnalytics!
    content: ContentAnalytics!
    activity: ActivityAnalytics!
  }

  type DateRange {
    start: DateTime!
    end: DateTime!
  }

  type AnalyticsOverview {
    totalProjects: Int!
    totalRevenue: Float!
    totalAssets: Int!
    totalCollaborations: Int!
    revenueGrowthRate: Float!
  }

  # Additional supporting types would continue here...
`;