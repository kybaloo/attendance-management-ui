"use client";

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
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { useUniversitiesQuery } from "@/hooks/queries/use-universities.query";
import { University } from "@/types/university.types";
import { RiBuilding2Line, RiScanLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { AddUniversityDialog } from "./components/add-university.dialog";
import { EditUniversityDialog } from "./components/edit-university.dialog";
import { UniversitiesTable } from "./components/universities.table";
import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { PageHeader } from "@/components/shared/page-header";

export default function UniversitiesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { setPageTitle } = useBreadcrumb();
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);

  const { data: user } = useCurrentUser();
  const { data: universities, isLoading, refetch } = useUniversitiesQuery();

  const isAdmin = user?.user?.role === "ADMIN";

  useEffect(() => {
    setPageTitle("Universités");
  }, [setPageTitle]);


  return (
    <div>
      <PageHeader
        icon={<RiBuilding2Line className="text-primary" />}
        title={"Gestion des universités"}
        subtitle={"Gérez les universités de votre institution."}
        action={{
          label: "Nouvelle université",
          onClick: () => setIsAddDialogOpen(true),
        }}
      />
      <div className="container mx-auto py-10">

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <UniversitiesTable
            universities={universities || []}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onEdit={(university) => setEditingUniversity(university)}
            onDelete={() => refetch()}
          />
        </div>
      </div>

      {/* Add University Dialog */}
      <AddUniversityDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={() => refetch()} />

      {/* Edit University Dialog */}
      <EditUniversityDialog
        isOpen={!!editingUniversity}
        onOpenChange={(open) => !open && setEditingUniversity(null)}
        university={editingUniversity}
      />
    </div>
  );
}
