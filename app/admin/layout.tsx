import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Dashboard | PASTEER3",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell contentClassName="md:pl-10">{children}</AdminShell>;
}
