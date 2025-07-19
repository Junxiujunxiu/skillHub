"use client";

import { NotificationSettingsFormData, notificationSettingsSchema } from '@/lib/schemas';
import { useUpdateUserMutation } from '@/state/api';
import { useUser } from '@clerk/nextjs';
import React from 'react'
import { useForm } from 'react-hook-form';
import Header from './Header';
import { CustomFormField } from './CustomFormField';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

/*
 Displays a "Notification Settings" form for the logged-in user,
 Shows a toggle (switch) for course notifications,
 Pre-fills the form with the user's current settings,
 Validates the input using Zod,
 Submits the updated settings to the server using RTK Query,
 And shows an error if something goes wrong.
*/

const SharedNotificationSettings = ({
    title = "Notification Settings", 
    subtitle="Manage your notification settings"}:
     SharedNotificationSettingsProps) => {
    const { user } = useUser();
    const [updateUser] = useUpdateUserMutation();

// Assuming user has a publicMetadata field with settings
    const currentSettings = (user?.publicMetadata as {settings?: UserSettings})?.settings || {};    
    
    /*setting up a form that collects notification settings. I'm using Zod to validate the input,
    and I'm pre-filling the form with whatever values are already saved in currentSettings. 
    If some values are missing, I’ll use safe defaults like false or "daily"."
    
    const methods = useForm<NotificationSettingsFormData>(...) function from react hook form that mange form state*/
    const methods = useForm<NotificationSettingsFormData>({
        //function that plugs in Zod to validate the form.
        resolver: zodResolver(notificationSettingsSchema),
        //These are the starting values for each form field.
        defaultValues: {
            courseNotifications: currentSettings.courseNotifications || false,
            emailAlerts: currentSettings.emailAlerts || false,
            smsAlerts: currentSettings.smsAlerts || false,
            notificationFrequency: currentSettings.notificationFrequency || "daily",
        }
    });

    /*“When the form is submitted, take the updated settings, combine them with the
     current user settings, and send a request to update the user. If something goes wrong,
      show an error in the console.”*/
    const onSubmit = async (data: NotificationSettingsFormData) => {
        //If the user is not logged in or not available, don’t do anything.”
        if(!user) return;

        //"Keep everything the user already had, but replace settings with the updated ones from the form."
        const updateduser = {
            userId: user.id,          
            publicMetadata: {
                ...user.publicMetadata,
                settings: {
                    ...currentSettings,
                    ...data, // Merge current settings with new data
                }
            }
        }

        try {
            await updateUser(updateduser);
            toast.success("Notification settings updated successfully");
        }catch (error) {
            toast.error("Failed to update settings");
            console.error("Failed to update user settings:", error);
        }

    };

    if(!user) return <div>Please log in to manage your notification settings.</div>;
  
    /* renders a form with a title, and one switch input that controls whether the user wants 
    course notifications. When the form is submitted, it validates the data using React Hook Form, 
    and calls the onSubmit function with the result.*/ 
    return (
    <div className="notification-settings">
        <Header title={title} subtitle={subtitle} />
        <Form {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="notification-settings__form"
            >
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

                <Button type="submit" className="notification-settings__submit">
                    update Settings
                </Button>
            </form>
        </Form>
    </div>
  )
}

export default SharedNotificationSettings

