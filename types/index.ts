export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  results?: number;
  meta?: { total: number; page: number; limit: number; totalPages: number };
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  ownerId?: string;
  profileImage?: { url?: string } | string;
  isSuspended?: boolean;
  createdAt?: string;
  memberSince?: string;
  status?: string;
  totalJobs?: number;
};

export type Job = {
  _id: string;
  jobRef?: string;
  customerName: string;
  phoneNumber?: string;
  emailAddress?: string;
  propertyAddress: string;
  status: "New" | "In Progress" | "Completed" | "Proposal Sent";
  date?: string;
  createdAt?: string;
  assignedTo?: User | null;
  selectedProducts?: Array<{ productId: Product; quantity: number; unitPrice: number; lineTotal: number }>;
  estimate?: { subTotal: number; installationCharge: number; deliveryCharge: number; taxRate: number; taxAmount: number; total: number };
  proposal?: { terms?: string; pdfUrl?: string; generatedAt?: string };
  design?: { layoutImage?: { url?: string }; layoutName?: string };
};

export type Product = {
  _id: string;
  sku: string;
  name: string;
  category: string;
  finish?: string[] | string;
  dimensions?: { width?: number; height?: number; depth?: number } | string;
  width?: number;
  height?: number;
  depth?: number;
  price: number;
  images?: Array<{ url?: string }>;
};

export type DashboardStats = {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  proposalSentJobs: number;
  totalStaff: number;
  totalCatalog: number;
  thisMonthRevenue: number;
  recentJobs: Job[];
};
