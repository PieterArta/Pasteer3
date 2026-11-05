import { getApplicants } from "@/lib/queries/applicants";
import { getForms } from "@/lib/queries/forms";
import { getAllPlottings } from "@/lib/queries/plotting";
import ApplicantsClient from "@/components/admin/ApplicantsClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ formId?: string }>;
}

export default async function AdminPendaftarPage({ searchParams }: Props) {
  const params = await searchParams;
  const [applicants, forms, plottings] = await Promise.all([
    getApplicants(),
    getForms(),
    getAllPlottings(),
  ]);

  return (
    <ApplicantsClient
      initialApplicants={applicants}
      forms={forms}
      plottings={plottings}
      initialFormId={params.formId}
    />
  );
}
