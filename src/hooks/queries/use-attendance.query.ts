import { AttendanceService } from "@/server/services/attendance.service";
import {
  Attendance,
  ClassSession,
  ClassSessionResponse,
  Course,
  CreateAttendanceInput,
  CreateClassSessionInput,
  CreateEmargementInput,
  Emargement,
  UpdateAttendanceInput,
  UpdateClassSessionInput,
  UpdateEmargementInput,
} from "@/types/attendance.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const attendanceQueryKeys = {
  attendances: ["attendances"],
  attendance: (id: string) => ["attendance", id],
  professorAttendances: (professorId: string) => ["attendances", "professor", professorId],
  todaysCourses: (professorId: string) => ["courses", "professor", professorId, "today"],
  weekCourses: (professorId: string, startDate: string) => ["courses", "professor", professorId, "week", startDate],
  classSessions: ["class-sessions"],
  classSession: (id: string) => ["class-sessions", id],
  professorClassSessions: (professorId: string) => ["class-sessions", "professor", professorId],
  emargements: ["emargements"],
  emargement: (id: string) => ["emargements", id],
};

export function useAttendancesQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...attendanceQueryKeys.attendances, page, limit],
    queryFn: () => AttendanceService.getAttendances(page, limit),
  });
}

export function useAttendanceQuery(id: string) {
  return useQuery({
    queryKey: attendanceQueryKeys.attendance(id),
    queryFn: () => AttendanceService.getAttendanceById(id),
    enabled: !!id,
  });
}

export function useProfessorAttendancesQuery(professorId: string) {
  return useQuery<Attendance[]>({
    queryKey: attendanceQueryKeys.professorAttendances(professorId),
    queryFn: () => AttendanceService.getProfessorAttendances(professorId),
    enabled: !!professorId,
  });
}

export function useProfessorTodaysCoursesQuery(professorId: string) {
  return useQuery<Course[]>({
    queryKey: attendanceQueryKeys.todaysCourses(professorId),
    queryFn: () => AttendanceService.getProfessorTodaysCourses(professorId),
    enabled: !!professorId,
  });
}

export function useCreateAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAttendanceInput) => AttendanceService.createAttendance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendances });
    },
  });
}

export function useUpdateAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAttendanceInput) => AttendanceService.updateAttendance(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendance(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendances });
    },
  });
}

// Nouveaux hooks pour les sessions de cours
export function useClassSessionsQuery(page = 1, limit = 10) {
  return useQuery<ClassSessionResponse>({
    queryKey: [...attendanceQueryKeys.classSessions, page, limit],
    queryFn: () => AttendanceService.getClassSessions(page, limit),
  });
}

export function useClassSessionQuery(id: string) {
  return useQuery<ClassSession>({
    queryKey: attendanceQueryKeys.classSession(id),
    queryFn: () => AttendanceService.getClassSessionById(id),
    enabled: !!id,
  });
}

export function useCreateClassSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateClassSessionInput) => AttendanceService.createClassSession(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.classSessions });
    },
  });
}

export function useUpdateClassSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateClassSessionInput) => AttendanceService.updateClassSession(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.classSession(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.classSessions });
    },
  });
}

export function useDeleteClassSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AttendanceService.deleteClassSession(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.classSessions });
    },
  });
}

export function useProfessorClassSessionsQuery(professorId: string, startDate?: string, endDate?: string) {
  return useQuery<ClassSession[]>({
    queryKey: [...attendanceQueryKeys.professorClassSessions(professorId), startDate, endDate],
    queryFn: () => AttendanceService.getProfessorClassSessions(professorId, startDate, endDate),
    enabled: !!professorId,
  });
}

// Nouveaux hooks pour les émargements
export function useEmargementsQuery(page = 1, limit = 10) {
  return useQuery<Emargement[]>({
    queryKey: [...attendanceQueryKeys.emargements, page, limit],
    queryFn: () => AttendanceService.getEmargements(page, limit),
  });
}

export function useEmargementQuery(id: string) {
  return useQuery<Emargement>({
    queryKey: attendanceQueryKeys.emargement(id),
    queryFn: () => AttendanceService.getEmargementById(id),
    enabled: !!id,
  });
}

export function useCreateEmargementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmargementInput) => AttendanceService.createEmargement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.emargements });
    },
  });
}

export function useUpdateEmargementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEmargementInput) => AttendanceService.updateEmargement(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.emargement(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.emargements });
    },
  });
}

export function useUpdateEmargementStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => AttendanceService.updateEmargementStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.emargement(variables.id) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.emargements });
    },
  });
}

// Hook pour récupérer les cours du professeur pour une semaine
export function useProfessorWeekCoursesQuery(professorId: string, startDate: string) {
  return useQuery<Course[]>({
    queryKey: attendanceQueryKeys.weekCourses(professorId, startDate),
    queryFn: () => AttendanceService.getProfessorWeekCourses(professorId, startDate),
    enabled: !!(professorId && startDate),
  });
}

// Hook alias pour l'émargement
export function useEmargementMutation() {
  return useCreateEmargementMutation();
}

// Hook pour récupérer les sessions de cours par semaine
export function useClassSessionsByWeekQuery(startDate: Date) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["current-user"]) as any;
  const userId = user?.user?.id || "";
  const formattedDate = startDate.toISOString().split("T")[0];

  return useQuery<ClassSession[]>({
    queryKey: ["class-sessions", "week", userId, formattedDate],
    queryFn: () => AttendanceService.getProfessorClassSessions(userId, formattedDate),
    enabled: !!(formattedDate && userId),
  });
}
