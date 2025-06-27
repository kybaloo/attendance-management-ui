"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { RiBookmarkLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { EditProgramDialog } from "./components/edit-program.dialog";
import { useProgramsQuery } from "@/hooks/queries/use-program.query";
import { Program } from "@/types/program.types";
import { ProgramsTable } from "./components/programs.table";
import { AddProgramDialog } from "./components/add-program.dialog";
import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { PageHeader } from "@/components/shared/page-header";

export default function ProgramsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { setPageTitle } = useBreadcrumb();
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  useCurrentUser();
  const { data: programs, isLoading, refetch } = useProgramsQuery();

  const isAdmin = true;

  useEffect(() => {
    setPageTitle("Programmes");
  }, [setPageTitle]);

  return (
    <div>
      <PageHeader
        icon={<RiBookmarkLine className="text-primary" />}
        title={"Gestion des programmes"}
        subtitle={"Gérez les programmes académiques de votre institution."}
        action={{
          label: "Nouveau programme",
          onClick: () => setIsAddDialogOpen(true),
        }}
      />
      <div className="container mx-auto py-10">
        {/* Page intro */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <RiBookmarkLine className="text-primary" />
              Programmes
            </h1>
            <p className="text-sm text-muted-foreground">Gérez les programmes académiques de votre institution.</p>
          </div>
          {isAdmin && <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter</Button>}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <ProgramsTable
            programs={programs || []}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onEdit={(program) => setEditingProgram(program)}
            onDelete={() => refetch()}
          />
        </div>
      </div>

      {/* Add Program Dialog */}
      <AddProgramDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={() => refetch()} />

      {/* Edit Program Dialog */}
      <EditProgramDialog
        isOpen={!!editingProgram}
        onOpenChange={(open) => !open && setEditingProgram(null)}
        program={editingProgram}
        onSuccess={() => refetch()}
      />
    </div>
  );
}