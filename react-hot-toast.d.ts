declare module "react-hot-toast" {
  import { ComponentType } from "react";
  const toast: {
    success: (msg: string, opts?: any) => void;
    error: (msg: string, opts?: any) => void;
    info: (msg: string, opts?: any) => void;
    loading: (msg: string, opts?: any) => void;
    dismiss: (id?: string) => void;
  };
  const Toaster: ComponentType<any>;
  export { toast, Toaster };

    export function error(arg0: any) {
      throw new Error("Function not implemented.");
    }
}