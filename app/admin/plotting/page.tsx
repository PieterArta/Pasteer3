import { getForms } from "@/lib/queries/forms";
import { getPlottingByForm } from "@/lib/queries/plotting";
import PlottingClient from "@/components/admin/PlottingClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ formId?: string }>;
}

export default async function AdminPlottingPage({ searchParams }: Props) {
  const params = await searchParams;
  const forms = await getForms();

  const selectedFormId =
    params.formId && forms.some((f) => f.id === params.formId)
      ? params.formId
      : forms[0]?.id || "";

  const plottingRows = selectedFormId
    ? await getPlottingByForm(selectedFormId)
    : [];

  return (
    <PlottingClient
      forms={forms}
      initialPlotting={plottingRows}
      selectedFormId={selectedFormId}
    />
  );
}
