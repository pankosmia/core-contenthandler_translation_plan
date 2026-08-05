import TranslationPlanViewerMuncher from "../components/translationPlanMuncher/muncher/Viewer/TranslationPlanViewerMuncher";
import { WrapperNav } from "../components/translationPlanMuncher/wrapperMuncher/WrapperNav";
import { useEffect, useContext, useState } from "react";
import { getJson } from "pankosmia-lib/http";
import {
  currentProjectContext,
  bcvContext,
  debugContext,
  i18nContext,
  typographyContext,
} from "pankosmia-rcl";
import { Box, Button } from "@mui/material";
import NewTranslationPlan from "./NewTranslationPlanContent";

export default function MuncherTest() {
  const { systemBcv } = useContext(bcvContext);
  console.log("🚀 ~ MuncherTest ~ systemBcv:", systemBcv);
  const { debugRef } = useContext(debugContext);
  console.log("🚀 ~ MuncherTest ~ debugRef:", debugRef);
  const { i18nRef } = useContext(i18nContext);
  console.log("🚀 ~ MuncherTest ~ i18nRef:", i18nRef);
  const { typographyRef } = useContext(typographyContext);
  console.log("🚀 ~ MuncherTest ~ typographyRef:", typographyRef);
  const { currentProjectRef } = useContext(currentProjectContext);
  console.log("🚀 ~ MuncherTest ~ currentProjectRef:", currentProjectRef);
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    async function getSummary() {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
        );
        if (fullMetadataResponse.ok) {
          const entry = fullMetadataResponse.json;
          setCurrentBurrito([projectPath, entry]);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-translation_plan:error", i18nRef.current)}: ${fullMetadataResponse.status}`,
            { variant: "error" },
          );
        }
      }
    }

    getSummary();
  }, [currentProjectRef.current]);

  const metadata = currentBurrito && {
    local_path: currentBurrito[0],
    ...currentBurrito[1],
  };
  const handleCreate = () => {
    window.location.href =
      "/clients/core-contenthandler_translation_plan/#/createDocument/translationPlan?returnTypePage=munchertest";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 3,
        height: "98vh",
      }}
    >
      <WrapperNav flavor={"x-translationplan"} />

      <Box sx={{ display: "flex", width: "100%", overflowY: "scroll" }}>
        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <Button onClick={handleCreate}> Create Translation Plan </Button>
            <TranslationPlanViewerMuncher
              key={metadata.local_path}
              metadata={metadata}
              debugRef={debugRef}
              systemBcv={systemBcv}
              i18nRef={i18nRef}
              typographyRef={typographyRef}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
