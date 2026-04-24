import type {
  User,
  ClientProfile,
  PartnerProfile,
  Category,
  ConciergeRequest,
  Recommendation,
  RequestUpdate,
  Message,
  Role,
  RequestStatus,
  UrgencyLevel,
  PartnerStatus,
  BudgetRange,
} from "@prisma/client";

export type {
  Role,
  RequestStatus,
  UrgencyLevel,
  PartnerStatus,
  BudgetRange,
};

export type SessionPayload = {
  userId: string;
  role: Role;
  email: string;
  name: string;
};

export type UserWithProfile = User & {
  clientProfile: ClientProfile | null;
  partnerProfile: PartnerProfile | null;
};

export type PartnerWithCategory = PartnerProfile & {
  category: Category;
};

export type RequestWithDetails = ConciergeRequest & {
  client: ClientProfile & { user: User };
  category: Category;
  assignedPartner: (PartnerProfile & { category: Category }) | null;
  recommendations: (Recommendation & { partner: PartnerProfile & { category: Category } })[];
  updates: RequestUpdate[];
  messages: (Message & { sender: User })[];
};

export type RecommendationWithPartner = Recommendation & {
  partner: PartnerWithCategory;
};

export type RequestWithClient = ConciergeRequest & {
  client: ClientProfile & { user: User };
  category: Category;
  assignedPartner: PartnerProfile | null;
  _count: { messages: number };
};

export type AdminStats = {
  totalClients: number;
  totalPartners: number;
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
};
