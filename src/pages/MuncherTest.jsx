import TranslationPlanViewerMuncher from "../components/translationPlanMuncher/muncher/Viewer/TranslationPlanViewerMuncher";
import { WrapperNav } from "../components/translationPlanMuncher/wrapperMuncher/WrapperNav";
import { useEffect, useContext, useState } from "react";
import { getJson } from "pankosmia-lib/http";
import { currentProjectContext, bcvContext } from "pankosmia-rcl";
import { Box, Button } from "@mui/material";
import NewTranslationPlan from "./NewTranslationPlanContent";

export default function MuncherTest() {
  const { bcvRef } = useContext(bcvContext);
  const { currentProjectRef } = useContext(currentProjectContext);
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
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
