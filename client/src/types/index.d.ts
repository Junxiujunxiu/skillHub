/* =========================================================
   GLOBAL TYPE DECLARATIONS
   - Shared interfaces & types available across the app
   ========================================================= */

   declare global {
    /* ---------- PAYMENT METHODS ---------- */
    interface PaymentMethod {
      methodId: string;
      type: string;
      lastFour: string;
      expiry: string;
    }
  
    /* ---------- USER SETTINGS ---------- */
    interface UserSettings {
      theme?: "light" | "dark"; // UI theme preference
      emailAlerts?: boolean; // Email notifications toggle
      smsAlerts?: boolean; // SMS notifications toggle
      courseNotifications?: boolean; // Course-related alerts
      notificationFrequency?: "immediate" | "daily" | "weekly"; // Notification timing
    }
  
    /* ---------- USER ---------- */
    interface User {
      userId: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email: string;
      publicMetadata: {
        userType: "teacher" | "student";
      };
      privateMetadata: {
        settings?: UserSettings;
        paymentMethods?: Array<PaymentMethod>;
        defaultPaymentMethodId?: string;
        stripeCustomerId?: string;
      };
      unsafeMetadata: {
        bio?: string;
        urls?: string[];
      };
    }
  
    /* ---------- COURSE ---------- */
    interface Course {
      courseId: string;
      teacherId: string;
      teacherName: string;
      title: string;
      description?: string;
      category: string;
      image?: string;
      price?: number; // Stored in cents (e.g., 4999 = $49.99)
      level: "Beginner" | "Intermediate" | "Advanced";
      status: "Draft" | "Published";
      sections: Section[];
      enrollments?: Array<{ userId: string }>;
    }
  
    /* ---------- TRANSACTION ---------- */
    interface Transaction {
      userId: string;
      transactionId: string;
      dateTime: string;
      courseId: string;
      paymentProvider: "stripe";
      paymentMethodId?: string;
      amount: number; // Stored in cents
      savePaymentMethod?: boolean;
    }
  
    /* ---------- DATE RANGE ---------- */
    interface DateRange {
      from: string | undefined;
      to: string | undefined;
    }
  
    /* ---------- COURSE PROGRESS ---------- */
    interface UserCourseProgress {
      userId: string;
      courseId: string;
      enrollmentDate: string;
      overallProgress: number;
      sections: SectionProgress[];
      lastAccessedTimestamp: string;
    }
  
    /* ---------- CREATE ARG TYPES ---------- */
    type CreateUserArgs = Omit<User, "userId">;
    type CreateCourseArgs = Omit<Course, "courseId">;
    type CreateTransactionArgs = Omit<Transaction, "transactionId">;
  
    /* ---------- COMPONENT PROPS: COURSE CARDS ---------- */
    interface CourseCardProps {
      course: Course;
      onGoToCourse: (course: Course) => void;
    }
  
    interface TeacherCourseCardProps {
      course: Course;
      onEdit: (course: Course) => void;
      onDelete: (course: Course) => void;
      isOwner: boolean;
    }
  
    /* ---------- COMMENT ---------- */
    interface Comment {
      commentId: string;
      userId: string;
      text: string;
      timestamp: string;
    }
  
    /* ---------- CHAPTER ---------- */
    interface Chapter {
      chapterId: string;
      title: string;
      content: string;
      video?: string | File;
      freePreview?: boolean;
      type: "Text" | "Quiz" | "Video";
    }
  
    /* ---------- CHAPTER & SECTION PROGRESS ---------- */
    interface ChapterProgress {
      chapterId: string;
      completed: boolean;
    }
  
    interface SectionProgress {
      sectionId: string;
      chapters: ChapterProgress[];
    }
  
    /* ---------- SECTION ---------- */
    interface Section {
      sectionId: string;
      sectionTitle: string;
      sectionDescription?: string;
      chapters: Chapter[];
    }
  
    /* ---------- COMPONENT PROPS: UI ELEMENTS ---------- */
    interface WizardStepperProps {
      currentStep: number;
    }
  
    interface AccordionSectionsProps {
      sections: Section[];
    }
  
    interface SearchCourseCardProps {
      course: Course;
      isSelected?: boolean;
      onClick?: () => void;
    }
  
    interface CoursePreviewProps {
      course: Course;
    }
  
    interface CustomFixedModalProps {
      isOpen: boolean;
      onClose: () => void;
      children: ReactNode;
    }
  
    interface HeaderProps {
      title: string;
      subtitle: string;
      rightElement?: ReactNode;
    }
  
    interface SharedNotificationSettingsProps {
      title?: string;
      subtitle?: string;
    }
  
    interface SelectedCourseProps {
      course: Course;
      handleEnrollNow: (courseId: string) => void;
    }
  
    interface ToolbarProps {
      onSearch: (search: string) => void;
      onCategoryChange: (category: string) => void;
    }
  
    interface ChapterModalProps {
      isOpen: boolean;
      onClose: () => void;
      sectionIndex: number | null;
      chapterIndex: number | null;
      sections: Section[];
      setSections: React.Dispatch<React.SetStateAction<Section[]>>;
      courseId: string;
    }
  
    interface SectionModalProps {
      isOpen: boolean;
      onClose: () => void;
      sectionIndex: number | null;
      sections: Section[];
      setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    }
  
    interface DroppableComponentProps {
      sections: Section[];
      setSections: (sections: Section[]) => void;
      handleEditSection: (index: number) => void;
      handleDeleteSection: (index: number) => void;
      handleAddChapter: (sectionIndex: number) => void;
      handleEditChapter: (sectionIndex: number, chapterIndex: number) => void;
      handleDeleteChapter: (sectionIndex: number, chapterIndex: number) => void;
    }
  
    /* ---------- COURSE FORM DATA ---------- */
    interface CourseFormData {
      courseTitle: string;
      courseDescription: string;
      courseCategory: string;
      coursePrice: string;
      courseStatus: boolean;
    }
  }
  
  export {};
  