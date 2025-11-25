import { redirect } from "next/navigation"

export default function AdminVehicleRedirect() {
  // Accept lowercase `/admin/vehicle` and redirect to the existing page
  redirect("/admin/Vahicle")
}
