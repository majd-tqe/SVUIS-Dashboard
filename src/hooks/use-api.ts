import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/api/client';
import type {
  StudentProfile,
  CurrentAverage,
  Semester,
  Payment,
  ExamOptions,
  ExamSchedule,
  Assessment,
  StudentClass,
  TutorOptions,
  TutorGroup,
} from '@/types';

export function useProfile() {
  return useQuery<StudentProfile>({
    queryKey: ['profile'],
    queryFn: () => apiGet<StudentProfile>('/student/profile'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentAverage() {
  return useQuery<CurrentAverage>({
    queryKey: ['currentAverage'],
    queryFn: () => apiGet<CurrentAverage>('/studies/average'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudies() {
  return useQuery<Semester[]>({
    queryKey: ['studies'],
    queryFn: () => apiGet<Semester[]>('/studies/profile'),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: () => apiGet<Payment[]>('/payments'),
    staleTime: 2 * 60 * 1000,
  });
}

export function useExamOptions() {
  return useQuery<ExamOptions>({
    queryKey: ['exam-options'],
    queryFn: () => apiGet<ExamOptions>('/studies/exams/options'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useExams(program: string | undefined, term: string | undefined) {
  return useQuery<ExamSchedule>({
    queryKey: ['exams', program, term],
    queryFn: () => apiGet<ExamSchedule>(`/studies/exams?program=${program}&term=${term}`),
    enabled: !!program && !!term,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAssessments() {
  return useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => apiGet<Assessment[]>('/assessments'),
    staleTime: 2 * 60 * 1000,
  });
}

export function useClasses() {
  return useQuery<StudentClass[]>({
    queryKey: ['classes'],
    queryFn: () => apiGet<StudentClass[]>('/classes'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTutorOptions(pid: string | undefined) {
  return useQuery<TutorOptions>({
    queryKey: ['tutor-options', pid],
    queryFn: () => apiGet<TutorOptions>(`/tutors/options${pid ? `?pid=${pid}` : ''}`),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTutorReport(pid: string | undefined, course: string | undefined, term: string | undefined) {
  return useQuery<TutorGroup[]>({
    queryKey: ['tutor-report', pid, course, term],
    queryFn: () => apiGet<TutorGroup[]>(`/tutors?pid=${pid}&course=${course}&term=${term}`),
    enabled: !!pid && !!course && !!term,
    staleTime: 5 * 60 * 1000,
  });
}
