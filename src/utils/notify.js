import { toast } from "react-toastify";
import Swal from "sweetalert2";

const base = {
  position: "top-right",
  autoClose: 3000,
};

export const notify = {
  info: (msg, opts = {}) => toast.info(msg, { ...base, ...opts }),
  success: (msg, opts = {}) => toast.success(msg, { ...base, ...opts }),
  warning: (msg, opts = {}) => toast.warning(msg, { ...base, ...opts }),
  error: (msg, opts = {}) => toast.error(msg, { ...base, ...opts }),
  confirm: async ({ title = "Apakah Kamu Yakin?", confirmText = "Yes" } = {}) => {
    const res = await Swal.fire({
      title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
    });
    return res.isConfirmed;
  },
};

