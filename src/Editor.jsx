import { JsonEditor } from "json-edit-react";
import { useState, useEffect } from "react";
export default function TranslationPlanEditorMuncher() {
  const [data, setData] = useState({});

  useEffect(() => {
    const doFetch = async () => {
      const planResponse = await getJson(
        `/api/burrito/ingredient/raw/${key}?ipath=plan.json`,
        debugRef.current,
      );
      if (planResponse.ok) {
        planJson = planResponse.json;
        setData(planJson);
      } else {
        setErrorMessage(
          `${doI18n("pages:core-contenthandler_text_translation:content_creation_error", i18nRef.current)}: ${planResponse.status}`,
        );
        return;
      }
    };
    doFetch().then();
  }, [open]);

  return (
    <>
      <p>Translation Plan Editor</p>
      <JsonEditor data={data} onChange={setData} />
    </>
  );
}
