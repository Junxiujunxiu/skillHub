import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, X, Plus } from "lucide-react";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register filepond plugins for image handling
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Props definition for custom form field component
interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "password"
    | "file"
    | "multi-input";
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
}

// Main CustomFormField component for rendering various input types
export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options,
  accept,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  multiple = false,
  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext(); // Access form context from react-hook-form

  // Render specific form control based on the provided "type" prop
  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    switch (type) {
      // Textarea input
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            rows={3}
            className={`border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
          />
        );

      // Select dropdown
      case "select":
        return (
          <Select
            value={field.value || (initialValue as string)}
            defaultValue={field.value || (initialValue as string)}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={`w-full border-none bg-customgreys-primarybg p-4 ${inputClassName}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full bg-customgreys-primarybg border-customgreys-dirtyGrey shadow">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={`cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      // Toggle switch
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              className={`text-customgreys-dirtyGrey ${inputClassName}`}
            />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        );

      // File upload using FilePond
      case "file":
        const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
        const acceptedFileTypes = accept ? [accept] : ACCEPTED_VIDEO_TYPES;

        return (
          <FilePond
            className={`${inputClassName}`}
            files={field.value ? [field.value] : []}
            allowMultiple={multiple}
            onupdatefiles={(fileItems) => {
              field.onChange(
                multiple
                  ? fileItems.map((fileItem) => fileItem.file)
                  : fileItems[0]?.file
              );
            }}
            acceptedFileTypes={acceptedFileTypes}
            labelIdle={`Drag & Drop your files or <span class="filepond--label-action">Browse</span>`}
            credits={false}
          />
        );

      // Number input
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            className={`border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );

      // Multi-input field array
      case "multi-input":
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        );

      // Default text-based input
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`border-none bg-customgreys-primarybg p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem
          className={`${
            type !== "switch" && "rounded-md"
          } relative ${className}`}
        >
          {/* Label section (not rendered for switch type) */}
          {type !== "switch" && (
            <div className="flex justify-between items-center">
              <FormLabel
                className={`text-customgreys-dirtyGrey text-sm ${labelClassName}`}
              >
                {label}
              </FormLabel>

              {/* Optional edit icon */}
              {!disabled &&
                isIcon &&
                type !== "file" &&
                type !== "multi-input" && (
                  <Edit className="size-4 text-customgreys-dirtyGrey" />
                )}
            </div>
          )}

          {/* Render actual input control */}
          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>

          {/* Validation error message */}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

// Props for multi-input dynamic field
interface MultiInputFieldProps {
  name: string;
  control: any;
  placeholder?: string;
  inputClassName?: string;
}

// Component for rendering dynamic input fields with add/remove buttons
const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {/* Render each input row */}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className={`flex-1 border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
                />
              </FormControl>
            )}
          />
          {/* Remove button */}
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-customgreys-dirtyGrey"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {/* Add new input button */}
      <Button
        type="button"
        onClick={() => append("")}
        variant="outline"
        size="sm"
        className="mt-2 text-customgreys-dirtyGrey"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};
