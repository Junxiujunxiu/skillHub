"use client";

import { NotificationSettingsFormData, notificationSettingsSchema } from '@/lib/schemas';
import { useUpdateUserMutation } from '@/state/api';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import { CustomFormField } from './CustomFormField';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

/* =========================================================
   SharedNotificationSettings Component
   - Displays a form for managing notification preferences
   - Features:
       1. Pre-fills with current settings from Clerk publicMetadata
       2. Validates input using Zod + React Hook Form
       3. Allows toggling:
            - Course Notifications
            - Email Alerts
            - SMS Alerts
            - Notification Frequency (Immediate / Daily / Weekly)
       4. Updates settings via RTK Query mutation
       5. Shows success/error toasts after submission
   ========================================================= */
const SharedNotificationSettings = ({
  title = "Notification Settings",
  subtitle = "Manage your notification settings"
}: SharedNotificationSettingsProps) => {

  /* ---------- Hooks & API ---------- */
  const { user } = useUser();
  const [updateUser] = useUpdateUserMutation();

  // Extract current settings or use defaults
  const currentSettings =
    (user?.publicMetadata as { settings?: UserSettings })?.settings || {};

  /* ---------- Form Setup (React Hook Form + Zod) ---------- */
  const methods = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      courseNotifications: currentSettings.courseNotifications || false,
      emailAlerts: currentSettings.emailAlerts || false,
      smsAlerts: currentSettings.smsAlerts || false,
      notificationFrequency: currentSettings.notificationFrequency || "daily",
    }
  });

  /* ---------- Submit Handler ---------- */
  const onSubmit = async (data: NotificationSettingsFormData) => {
    if (!user) return;

    const updatedUser = {
      userId: user.id,
      publicMetadata: {
        ...user.publicMetadata,
        settings: {
          ...currentSettings,
          ...data, // merge updated values
        }
      }
    };

    try {
      await updateUser(updatedUser);
      toast.success("Notification settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error("Failed to update user settings:", error);
    }
  };

  /* ---------- Render ---------- */
  if (!user)
    return <div>Please log in to manage your notification settings.</div>;

  return (
    <div className="notification-settings">
      {/* Section header */}
      <Header title={title} subtitle={subtitle} />

      {/* Form container */}
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="notification-settings__form"
        >
          {/* Form fields */}
          <div className="notification-settings__fields">
            <CustomFormField
              name="courseNotifications"
              label="Course Notifications"
              type="switch"
            />
            <CustomFormField
              name="emailAlerts"
              label="Email Alerts"
              type="switch"
            />
            <CustomFormField
              name="smsAlerts"
              label="SMS Alerts"
              type="switch"
            />
            <CustomFormField
              name="notificationFrequency"
              label="Notification Frequency"
              type="select"
              options={[
                { value: "immediate", label: "Immediate" },
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" }
              ]}
            />
          </div>

          {/* Submit button */}
          <Button type="submit" className="notification-settings__submit">
            Update Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SharedNotificationSettings;
