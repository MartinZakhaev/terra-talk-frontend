import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (
  message: string,
  type: ToastType = "info",
  options?: Partial<ToastOptions>
) => {
  const toastOptions = {
    ...defaultOptions,
    ...options,
  };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    case "info":
    default:
      toast.info(message, toastOptions);
      break;
  }
};

// Convenience methods
export const toastSuccess = (
  message: string,
  options?: Partial<ToastOptions>
) => showToast(message, "success", options);

export const toastError = (message: string, options?: Partial<ToastOptions>) =>
  showToast(message, "error", options);

export const toastWarning = (
  message: string,
  options?: Partial<ToastOptions>
) => showToast(message, "warning", options);

export const toastInfo = (message: string, options?: Partial<ToastOptions>) =>
  showToast(message, "info", options);
