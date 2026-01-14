export interface MediaItem {
  id: string;
  title: string;
  poster: string;
  rating?: number;
}

export interface ShelfProps {
  title: string;
  data: MediaItem[];
  showProgress?: boolean;
  showViewAll?: boolean;
  viewAllText?: string;
  onViewAllPress?: () => void;
  onItemPress?: (item: MediaItem) => void;
}
