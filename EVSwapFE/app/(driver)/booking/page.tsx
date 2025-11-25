import { redirect } from "next/navigation";

export default function BookingPage() {
  // Redirect /booking to the station finder which is the driver's main booking entry
  redirect("/booking/find-stations");
}
