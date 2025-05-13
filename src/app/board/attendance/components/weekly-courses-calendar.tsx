"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEmargementMutation } from "@/hooks/queries/use-attendance.query";
import { Course } from "@/types/attendance.types";
import { RiArrowLeftSLine, RiArrowRightSLine, RiCalendarCheckLine, RiMapPinLine, RiTimeLine } from "@remixicon/react";
import { addDays, addWeeks, format, isSameDay, startOfWeek, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface WeeklyCoursesCalendarProps {
  courses: Course[];
  isLoading: boolean;
  onAttendanceSubmitted: () => void;
  weekStartDate: Date;
}

export function WeeklyCoursesCalendar({ courses, isLoading, onAttendanceSubmitted, weekStartDate }: WeeklyCoursesCalendarProps) {
  const [currentDate, setCurrentDate] = useState(weekStartDate);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mutation pour l'émargement
  const { mutate: submitEmargement, isPending } = useEmargementMutation();

  // Générer les jours de la semaine
  const weekDays = useMemo(() => {
    const days = [];
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }

    return days;
  }, [currentDate]);

  // Gérer la navigation entre les semaines
  const goToPreviousWeek = () => {
    const newDate = subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    // Notifier le parent d'un changement de semaine pour recharger les données
    onAttendanceSubmitted();
  };

  const goToNextWeek = () => {
    const newDate = addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    // Notifier le parent d'un changement de semaine pour recharger les données
    onAttendanceSubmitted();
  };

  const goToCurrentWeek = () => {
    setCurrentDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
    // Notifier le parent d'un changement de semaine pour recharger les données
    onAttendanceSubmitted();
  };

  // Ouvrir le dialogue d'émargement pour un cours spécifique
  const openEmargementDialog = (course: Course) => {
    setSelectedCourse(course);
    setComments("");
    setDialogOpen(true);
  };

  // Soumettre l'émargement
  const handleSubmitEmargement = () => {
    if (!selectedCourse) return;

    submitEmargement(
      {
        classSessionId: selectedCourse.id,
        status: "PRESENT",
        professorId: "", // À récupérer depuis le contexte utilisateur
        comments: comments.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Émargement effectué avec succès");
          setDialogOpen(false);
          onAttendanceSubmitted();
        },
        onError: (error) => {
          toast.error("Erreur lors de l'émargement du cours");
          console.error("Erreur émargement:", error);
        },
      }
    );
  };

  // Récupérer les cours d'un jour spécifique
  const getCoursesByDay = (day: Date) => {
    if (!courses) return [];
    return courses.filter((course) => {
      try {
        const courseDate = new Date(course.startTime);
        return isSameDay(courseDate, day);
      } catch (error) {
        return false;
      }
    });
  };

  // Formatter l'heure de façon lisible
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, "HH:mm", { locale: fr });
    } catch (error) {
      return timeString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Chargement du calendrier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Navigation du calendrier */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={goToPreviousWeek}>
            <RiArrowLeftSLine className="mr-1" /> Semaine précédente
          </Button>
          <Button size="sm" variant="outline" onClick={goToCurrentWeek}>
            Semaine actuelle
          </Button>
          <Button size="sm" variant="outline" onClick={goToNextWeek}>
            Semaine suivante <RiArrowRightSLine className="ml-1" />
          </Button>
        </div>
        <div className="text-sm font-semibold">
          {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd/MM/yyyy", { locale: fr })} au{" "}
          {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), "dd/MM/yyyy", { locale: fr })}
        </div>
      </div>

      {/* Calendrier hebdomadaire */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="min-h-[200px]">
            <div
              className={`text-center py-2 mb-2 font-medium rounded-lg ${
                isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div>{format(day, "EEEE", { locale: fr })}</div>
              <div>{format(day, "dd/MM", { locale: fr })}</div>
            </div>

            <div className="space-y-2">
              {getCoursesByDay(day).length === 0 ? (
                <div className="text-center text-xs text-muted-foreground p-2">Aucun cours</div>
              ) : (
                getCoursesByDay(day).map((course) => (
                  <Card key={course.id} className={`${course.hasAttendance ? "border-green-500/20" : ""}`}>
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm flex justify-between">
                        {course.title}
                        {course.hasAttendance && (
                          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">Émargé</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-1 px-3">
                      <div className="text-xs flex items-center">
                        <RiTimeLine className="mr-1" size={12} />
                        {formatTime(course.startTime)} - {formatTime(course.endTime)}
                      </div>
                      <div className="text-xs flex items-center">
                        <RiMapPinLine className="mr-1" size={12} />
                        {course.location}
                      </div>
                    </CardContent>
                    {!course.hasAttendance && (
                      <CardFooter className="py-1 px-3">
                        <Button size="sm" className="w-full" onClick={() => openEmargementDialog(course)}>
                          <RiCalendarCheckLine className="mr-1" size={14} />
                          Émarger
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialogue d'émargement */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Émarger pour ce cours</DialogTitle>
            <DialogDescription>Confirmez votre présence pour ce cours</DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-1">Cours</h3>
                <p className="text-sm">{selectedCourse.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm mb-1">Date et heure</h3>
                  <p className="text-sm">
                    {format(new Date(selectedCourse.startTime), "dd/MM/yyyy", { locale: fr })}, {formatTime(selectedCourse.startTime)}{" "}
                    - {formatTime(selectedCourse.endTime)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Lieu</h3>
                  <p className="text-sm">{selectedCourse.location}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Commentaires (optionnel)</h3>
                <Textarea
                  placeholder="Ajouter des commentaires sur le cours..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitEmargement} disabled={isPending}>
              {isPending ? "Enregistrement..." : "Confirmer l'émargement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
