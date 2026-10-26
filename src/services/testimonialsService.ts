import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Testimonial {
  id: string;
  clientName: string;
  companyOrRole?: string;
  rating: number;
  reviewAr: string;
  reviewEn: string;
  serviceCategory: 'podcasts' | 'reels' | 'commercials' | 'studio';
  avatarUrl?: string;
  verified?: boolean;
  approved: boolean;
  createdAt: string;
}

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    clientName: 'د. كريم عبد العزيز',
    companyOrRole: 'مقدم بودكاست "المسار"',
    rating: 5,
    reviewAr: 'استوديو KIN نقل بودكاست المسار لمستوى سينمائي عالمي تماماً. جودة الإضاءة، عزل الصوت في الكوربة، والمونتاج السريع بـ 4K خلى الضيوف ينبهروا بالنتيجة من أول حلقة. الإتقان عندهم شعار حقيقي.',
    reviewEn: 'KIN Studio elevated "Al-Masar" podcast to an international cinematic caliber. Lighting precision, flawless acoustic isolation in Korba, and rapid 4K turnaround left our guests stunned from episode one.',
    serviceCategory: 'podcasts',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified: true,
    approved: true,
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'testi-2',
    clientName: 'ياسمين الهواري',
    companyOrRole: 'Brand Director — LUMA Cairo',
    rating: 5,
    reviewAr: 'باقة الريلز الشهرية من KIN كانت أفضل استثمار للبراند بتاعنا. صوّرنا 12 ريلز في يوم واحد بإخراج وتنسيق فني دقيق، وتفاعل الجمهور على إنستجرام زاد بأكتر من 300% في شهرين.',
    reviewEn: 'The monthly Reels package with KIN was the absolute best investment for our brand. We produced 12 high-end reels in a single session, driving over 300% Instagram engagement growth.',
    serviceCategory: 'reels',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    verified: true,
    approved: true,
    createdAt: '2025-02-01T12:00:00.000Z',
  },
  {
    id: 'testi-3',
    clientName: 'م. شريف المنياوي',
    companyOrRole: 'Founder — NextWave FinTech',
    rating: 5,
    reviewAr: 'فريق محترف لأبعد الحدود. صورنا إعلان إطلاق التطبيق الجديد، وحصلنا على ألوان وإضاءة درامية جذابة جداً. والأهم هو التزامهم بالمواعيد والتسليم برابط محمي وجودة ماستر.',
    reviewEn: 'Consummate professionals. They shot our app launch commercial with dramatic lighting and exquisite color grading. Delivered on schedule with secure 4K master links.',
    serviceCategory: 'commercials',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verified: true,
    approved: true,
    createdAt: '2025-02-18T14:30:00.000Z',
  },
  {
    id: 'testi-4',
    clientName: 'سارة رضوان',
    companyOrRole: 'صانعة محتوى ومقدمة برامج',
    rating: 5,
    reviewAr: 'تجربة التصوير في استوديو KIN مريحة جداً؛ معدات سوني Cinema Line والميكروفونات الاحترافية بتخلي الصوت نقي بدون أي تشويش. منصة العميل بتسهل معاينة الحلقات وتنزيلها بسهولة.',
    reviewEn: 'Filming at KIN Studio is an effortless experience. Sony Cinema Line rigs and studio-grade mics give pristine acoustics. The client portal makes reviewing and downloading seamless.',
    serviceCategory: 'podcasts',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    verified: true,
    approved: true,
    createdAt: '2025-03-02T09:15:00.000Z',
  },
  {
    id: 'testi-5',
    clientName: 'أحمد نبيل العطار',
    companyOrRole: 'CEO — Maison d’Art',
    rating: 5,
    reviewAr: 'أفضل استوديو إنتاج في مصر الجديدة بلا منازع. الفهم العالي للهوية البصرية والذوق الرفيع خلى منتجاتنا تظهر بأفخم صورة ممكنة. كيرو ومينا وفريق العمل دايماً في ضهرك.',
    reviewEn: 'Hands down the finest production house in Heliopolis. Their refined visual sensibility and luxury taste elevated our product showcase. Mina, Kero, and crew are phenomenal partners.',
    serviceCategory: 'commercials',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verified: true,
    approved: true,
    createdAt: '2025-03-10T16:00:00.000Z',
  },
];

/**
 * Public subscriber: listens to approved reviews
 */
export function subscribeApprovedTestimonials(
  onUpdate: (items: Testimonial[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'testimonials';
  const q = query(collection(db, path), where('approved', '==', true));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onUpdate(INITIAL_TESTIMONIALS);
        return;
      }
      const items: Testimonial[] = snap.docs.map((d) => d.data() as Testimonial);
      items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      onUpdate(items.length > 0 ? items : INITIAL_TESTIMONIALS);
    },
    (err) => {
      console.warn('Falling back to local testimonials:', err);
      onUpdate(INITIAL_TESTIMONIALS);
      if (onError) onError(err);
    }
  );
}

/**
 * Admin subscriber: listens to all reviews (pending + approved)
 */
export function subscribeAllTestimonials(
  onUpdate: (items: Testimonial[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'testimonials';
  const q = query(collection(db, path));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onUpdate(INITIAL_TESTIMONIALS);
        return;
      }
      const items: Testimonial[] = snap.docs.map((d) => d.data() as Testimonial);
      items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      onUpdate(items);
    },
    (err) => {
      console.warn('Error loading all testimonials, falling back:', err);
      onUpdate(INITIAL_TESTIMONIALS);
      if (onError) onError(err);
    }
  );
}

/**
 * Submit a new review (pending admin approval by default)
 */
export async function submitTestimonial(
  data: Omit<Testimonial, 'id' | 'createdAt'>,
  isAdmin: boolean = false
): Promise<string> {
  const path = 'testimonials';
  const id = 'testi-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const record: Testimonial = {
    ...data,
    id,
    approved: isAdmin ? true : false,
    createdAt: now,
  };

  try {
    await setDoc(doc(db, path, id), record);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

/**
 * Admin: approve or reject testimonial
 */
export async function setTestimonialApproval(id: string, approved: boolean): Promise<void> {
  const path = 'testimonials';
  try {
    await updateDoc(doc(db, path, id), { approved });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

/**
 * Admin: delete testimonial
 */
export async function deleteTestimonial(id: string): Promise<void> {
  const path = 'testimonials';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}
