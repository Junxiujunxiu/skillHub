import SharedNotificationSettings from "@/components/SharedNotificationSettings";
import React from "react";

/* =========================================================
   Page: TeacherSettings
   Purpose:
     - Displays notification settings specific to teachers.
     - Reuses the SharedNotificationSettings component to ensure
       consistent UI/UX across different user roles.
   Layout:
     - Centers content in a container that takes up 60% (w-3/5) of
       the available width.
   Props to SharedNotificationSettings:
     - title: Page heading ("Teacher Settings")
     - subtitle: Short description of the page purpose
   ========================================================= */
const TeacherSettings = () => {
  return (
    <div className="w-3/5">
      <SharedNotificationSettings
        title="Teacher Settings"
        subtitle="Manage your teacher notification settings"
      />
    </div>
  );
};

export default TeacherSettings;
