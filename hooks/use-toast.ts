"use client";

import {
  toast as sonnerToast,
  type ToasterProps as SonnerToastProps,
} from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const showToast = (type: ToastType, options: ToastOptions) => {
    const { title, description, duration = 5000, action } = options;

    const toastOptions: SonnerToastProps = {
      duration,
      ...(action && {
        action: {
          label: action.label,
          onClick: action.onClick,
        },
      }),
    };

    switch (type) {
      case "success":
        sonnerToast.success(title, {
          description,
          ...toastOptions,
        });
        break;
      case "error":
        sonnerToast.error(title, {
          description,
          ...toastOptions,
        });
        break;
      case "info":
        sonnerToast.info(title, {
          description,
          ...toastOptions,
        });
        break;
      case "warning":
        sonnerToast.warning(title, {
          description,
          ...toastOptions,
        });
        break;
      default:
        sonnerToast(title, {
          description,
          ...toastOptions,
        });
    }
  };

  // Return a simplified API
  return {
    success: (options: ToastOptions) => showToast("success", options),
    error: (options: ToastOptions) => showToast("error", options),
    info: (options: ToastOptions) => showToast("info", options),
    warning: (options: ToastOptions) => showToast("warning", options),
    dismiss: sonnerToast.dismiss,
    // Legacy method for backward compatibility
    toast: (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (props.variant === "destructive") {
        showToast("error", {
          title: props.title,
          description: props.description,
        });
      } else {
        showToast("info", {
          title: props.title,
          description: props.description,
        });
      }
    },
  };
}
