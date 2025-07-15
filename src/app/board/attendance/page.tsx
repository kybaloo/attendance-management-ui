"use client";

import { CalendarProvider } from "@/components/calendar-context";
import AttendanceCalendar from "@/components/calendar/attendance-calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useProfessorClassSessionsQuery, useProfessorTodaysCoursesQuery } from "@/hooks/queries/use-attendance.query";
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { RiCalendar2Line, RiCheckboxLine } from "@remixicon/react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useEffect } from "react";
import { TodaysCoursesList } from "./components/todays-courses-list";

export default function AttendancePage() {
  const { data: user } = useCurrentUser();
  const { setPageTitle } = useBreadcrumb();
  const userId = user?.user?.id;
  const isProfessor = user?.user?.role === "TEACHER";

  // État pour la semaine sélectionnée
  const selectedWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const selectedWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Formater les dates pour la requête API
  const weekStartDateString = format(selectedWeekStart, "yyyy-MM-dd");
  const weekEndDateString = format(selectedWeekEnd, "yyyy-MM-dd");

  // Requête pour les cours du jour (liste)
  const {
    data: todaysCourses,
    isLoading: isTodayLoading,
    refetch: refetchTodaysCourses,
  } = useProfessorTodaysCoursesQuery(userId || "");

  // Requête pour les sessions de cours de la semaine (calendrier)
  const {
    data: weekClassSessions,
    isLoading: isWeekLoading,
    refetch: refetchWeekClassSessions,
  } = useProfessorClassSessionsQuery(userId || "", weekStartDateString, weekEndDateString);

  // Rafraîchir les données selon l'onglet actif
  const refetchCurrentTab = (activeTab: string) => {
    if (activeTab === "today") {
      refetchTodaysCourses();
    } else {
      refetchWeekClassSessions();
    }
  };

  useEffect(() => {
    setPageTitle("Émargement des cours");
  }, [setPageTitle]);

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <RiCheckboxLine className="text-primary" />
            Émargement des cours
          </h1>
          <p className="text-sm text-muted-foreground">Émargez vos cours pour confirmer votre présence.</p>
        </div>
      </div>

      {isProfessor ? (
        <Tabs defaultValue="today" className="w-full" onValueChange={(value) => refetchCurrentTab(value)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="today" className="flex items-center gap-2">
                <RiCheckboxLine size={18} />
                <span>Aujourd&apos;hui</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-2">
                <RiCalendar2Line size={18} />
                <span>Calendrier</span>
              </TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              onClick={() => refetchCurrentTab(document.querySelector('[aria-selected="true"]')?.getAttribute("value") || "today")}
            >
              Actualiser
            </Button>
          </div>
          <TabsContent value="today" className="mt-0">
            <TodaysCoursesList
              courses={todaysCourses || []}
              isLoading={isTodayLoading}
              onAttendanceSubmitted={() => refetchTodaysCourses()}
            />
          </TabsContent>
          <TabsContent value="week" className="mt-0">
            <CalendarProvider>
              <AttendanceCalendar
                classSessions={weekClassSessions || []}
                isLoading={isWeekLoading}
                onAttendanceSubmitted={() => refetchWeekClassSessions()}
              />
            </CalendarProvider>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Vous n&apos;êtes pas autorisé à accéder à cette page. Seuls les professeurs peuvent émarger.
          </p>
        </div>
      )}
    </div>
  );
}
