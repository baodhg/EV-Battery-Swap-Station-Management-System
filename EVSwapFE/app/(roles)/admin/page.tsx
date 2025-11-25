import { redirect } from "next/navigation"

export default function AdminIndexPage() {
  // Redirect `/admin` to the dashboard subpage to avoid 404
  redirect("/admin/dashboard")
}
