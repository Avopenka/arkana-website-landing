// Component type definitions
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AsyncComponentState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface FilterState {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface AssetValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: {
    fileSize: number;
    dimensions?: { width: number; height: number };
    format?: string;
    optimized: boolean;
  };
}
