export interface StudentProfile {
  id: number;
  username: string;
  names: {
    firstAr: string;
    fatherAr: string;
    motherAr: string;
    surnameAr: string;
    firstEn: string;
    fatherEn: string;
    motherEn: string;
    surnameEn: string;
    fullAr: string;
    fullEn: string;
  };
  birth: { date: string; place: string };
  gender: string;
  maritalStatus: string;
  militaryStatus: string;
  nationality: string;
  sidNumber: string;
  contact: {
    country: string;
    city: string;
    address: string;
    phone: string;
    mobile: string;
    email: string;
  };
  registration: {
    date: string;
    term: string;
    status: string;
  };
  account: {
    id: number;
    currency: string;
    balance: number;
    status: string;
  };
  programs: string[];
  documents: string[];
}

export interface GradeWeights {
  e1: number;
  e2: number;
  e3: number;
  midterm: number;
  oral: number;
  practical: number;
  finalExam: number;
  total: number;
}

export interface GradeScores {
  e1: number | null;
  e2: number | null;
  e3: number | null;
  midterm: number | null;
  oral: number | null;
  practical: number | null;
  finalExam: number | null;
  total: number | null;
}

export interface CourseGrade {
  code: string;
  name?: string;
  chr: number;
  mark: number | null;
  letterGrade: string;
  gpaValue: number | null;
  status: string;
  term?: string;
  helped: boolean;
  weights?: GradeWeights;
  scores?: GradeScores;
}

export interface Semester {
  term: string;
  termCode?: string;
  year: string;
  gpa?: number;
  average?: number;
  courses: CourseGrade[];
}

export interface CurrentAverage {
  program: string;
  specialization: string;
  studentTerm: string;
  average: number;
  gpa: number;
  literalGrade: string;
  completedPass: number;
  completedExempt: number;
  englishChr: number;
  completedExam: number;
  chr: number;
  engPt: number;
  courses: AverageGradeEntry[];
}

export interface AverageGradeEntry {
  status: string;
  courseCode: string;
  chr: number;
  mark: number | null;
  term: string;
  letterGrade: string;
  gpaValue: number | null;
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  term: string;
  validator: string;
  specialAmount: number;
  program: string;
  forDelete: string;
  processStatus: string;
  link: string;
}

export interface ExamOptions {
  programs: { value: string; label: string }[];
  terms: { value: string; label: string }[];
}

export interface ExamEntry {
  course: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  telecenter: string;
}

export interface ExamSchedule {
  program: number | string;
  term: number | string;
  exams: ExamEntry[];
}

export interface Assessment {
  course: string;
  startTime: string;
  endTime: string;
  status: string;
  score: number | null;
  alert: string | null;
}

export interface StudentClass {
  sessionTime?: string;
  course: string;
  class: string;
  tutor: string;
  email?: string;
  term?: string;
}

export interface TutorEntry {
  course: string;
  class: string;
  tutor: string;
  percent: string;
  term: string;
  group?: string;
}

export interface TutorGroup {
  group: string;
  entries: TutorEntry[];
}

export interface TutorOptions {
  programs: { value: string; label: string }[];
  courses: { value: string; label: string }[];
  terms: { value: string; label: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta: {
    cached: boolean;
    fetchedAt: string;
  };
}

export interface AuthStatus {
  loggedIn: boolean;
}

export interface LoginResponse {
  sessionId: string;
  student: {
    id: number;
    username: string;
    name: string;
  };
}

export interface EPaymentStatus {
  hasDue: boolean;
  message: string;
}
