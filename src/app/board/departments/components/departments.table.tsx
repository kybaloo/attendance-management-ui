import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Department } from "@/types/departments.types";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { RiDeleteBinLine, RiEdit2Line } from "@remixicon/react";
import React from "react";

interface DepartmentsTableProps {
  departments: Department[];
  isLoading: boolean;
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
}

export function DepartmentsTable({ departments, isLoading, onEdit, onDelete }: Readonly<DepartmentsTableProps>) {
  if (isLoading) {
    return <div>Chargement des départements...</div>;
  }

  if (departments.length === 0) {
    return <div>Aucun département trouvé.</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Université</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.university?.name ?? "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(department)}>
                    <RiEdit2Line className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <RiDeleteBinLine className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement le département{" "}
                          {department.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(department.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};