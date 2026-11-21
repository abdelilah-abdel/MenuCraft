import { notFound } from 'next/navigation';
import { isTemplateId } from '@/lib/templates/config';
import { TemplateExample } from '@/components/preview/TemplateExample';

export default async function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isTemplateId(id)) notFound();
  return <TemplateExample template={id} />;
}
