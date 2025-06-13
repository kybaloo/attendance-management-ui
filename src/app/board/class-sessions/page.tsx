"use client";

import { CalendarProvider } from "@/components/calendar-context";
import CourseCalendar from "@/components/calendar/course-calendar";
import { AppSidebar } from "@/components/shared/navigation/app.sidebar";
import UserDropdown from "@/components/shared/navigation/user.dropdown";
import FeedbackDialog from "@/components/shared/others/feedback.dialog";
import { ModeToggle } from "@/components/shared/theme/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useClassSessionsQuery } from "@/hooks/queries/use-class-session.query";
import { RiCalendarLine, RiScanLine } from "@remixicon/react";
import { useState } from "react";
import { AddClassSessionDialog } from "./components/add-class-session.dialog";

export default function ClassSessionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Récupération des sessions de cours
  const { data, isLoading, refetch } = useClassSessionsQuery();

  // Rafraîchir les données
  const refetchCurrentTab = () => {
    refetch();
  };

  // Calculer les données paginées
  const classSessions = Array.isArray(data) ? data : [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="-ms-4" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/board">
                    <RiScanLine size={22} aria-hidden="true" />
                    <span className="sr-only">Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sessions de cours</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-3 ml-auto">
            <FeedbackDialog />
            <ModeToggle />
            <UserDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          {/* Page intro */}
          <div className="flex items-center justify-between gap-4">
            <div className="items-center gap-2">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <RiCalendarLine className="text-primary" />
                Sessions de cours
              </h1>
              <p className="text-sm text-muted-foreground">Visualisez et gérez les sessions de cours.</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter une session</Button>
          </div>{" "}
          {/* Replace Tabs and custom calendar with BigCalendar */}
          <div className="w-full">
            <CalendarProvider>
              <CourseCalendar classSessions={classSessions} isLoading={isLoading} />
            </CalendarProvider>
          </div>
          {/* Dialog d'ajout de session de cours */}
          <AddClassSessionDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={refetchCurrentTab} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
