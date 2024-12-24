import { Heading1, Heading4 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getTranslations } from 'next-intl/server';

const SECTIONS = ['how-to-register', 'how-to-restore-password'];

const INTL_NAMESPACE = 'private.faq';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function FAQPage() {
  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Accordion type="multiple" className="mt-8">
          {SECTIONS.map((section) => (
            <AccordionItem value={section} key={section}>
              <AccordionTrigger>
                <Heading4 className="my-0">{t(`sections.${section}.header`)}</Heading4>
              </AccordionTrigger>
              <AccordionContent className="ml-12 text-lg">{t.rich(`sections.${section}.content`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SubLayout>
  );
}
