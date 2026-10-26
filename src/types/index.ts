export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export type ServiceCategory = 'podcasts' | 'reels' | 'commercials';

export interface PricingPackage {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  period: string;
  unitAr: string;
  unitEn: string;
  recommended?: boolean;
  highlightAr?: string;
  highlightEn?: string;
  featuresAr: string[];
  featuresEn: string[];
  deliverablesAr: string;
  deliverablesEn: string;
  sessionTimeAr?: string;
  sessionTimeEn?: string;
  revisionsAr?: string;
  revisionsEn?: string;
  turnaroundAr?: string;
  turnaroundEn?: string;
  cameras?: string;
  sound?: string;
  clipsCount?: number;
}

export interface PortfolioItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'podcasts' | 'reels' | 'commercials';
  client: string;
  duration: string;
  aspectRatio: '16:9' | '9:16';
  coverImage: string;
  summaryAr: string;
  summaryEn: string;
  instagramUrl: string;
  instagramCaptionAr: string;
  instagramCaptionEn: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: string;
  instagramShortcode?: string;
  instagramEmbedUrl?: string;
  videoUrl?: string;
  specs: {
    camerasAr: string;
    camerasEn: string;
    soundAr: string;
    soundEn: string;
    deliverablesAr: string;
    deliverablesEn: string;
    colorGradeAr: string;
    colorGradeEn: string;
  };
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  packageId: string;
  preferredDate: string;
  addons: string[];
  notes?: string;
}
