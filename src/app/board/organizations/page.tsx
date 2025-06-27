"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { PiBuildingsDuotone } from "react-icons/pi";
import { EditOrganizationDialog } from "./components/edit-organizations.dialog";
import { useOrganizationsQuery } from "@/hooks/queries/use-organizations.query";
import { Organization } from "@/types/organization.types";
import { useEffect, useState } from "react";
import { AddOrganizationDialog } from "./components/add-organization.dialog";
import { OrganizationsTable } from "./components/organizations.table";
import { useBreadcrumb } from "@/contexts/breadcrumb.context";

export default function AcademicYearsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<Organization | null>(null);

  const { setPageTitle } = useBreadcrumb();
  const { data: user } = useCurrentUser();
  const { data: organizations, isLoading, refetch } = useOrganizationsQuery();

  const isAdmin = true;

  useEffect(() => {
    setPageTitle("Organisations");
  }, [setPageTitle]);

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
        {/* Page intro */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <PiBuildingsDuotone className="text-primary" />
              Organisations
            </h1>
            <p className="text-sm text-muted-foreground">Gérez les organisations de votre institution.</p>
          </div>
          {isAdmin && <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter</Button>}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <OrganizationsTable
            organizations={organizations || []}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onEdit={(org) => setEditingYear(org)}
            onDelete={() => refetch()}
          />
        </div>
      </div>

      {/* Add Organization Dialog */}
      <AddOrganizationDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={() => refetch()} />

      {/* Edit Organization Dialog */}
      <EditOrganizationDialog
        isOpen={!!editingYear}
        onOpenChange={(open) => !open && setEditingYear(null)}
        organization={editingYear}
      />
    </div>
  );
}
