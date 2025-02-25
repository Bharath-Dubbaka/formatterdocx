import React from "react";

export function Spinner({ className }) {
   return (
      <div
         className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      />
   );
}
