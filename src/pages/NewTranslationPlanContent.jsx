import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  debugContext,
  Header,
  PanVersificationPicker,
  PanBookPicker,
} from "pankosmia-rcl";
import ErrorDialog from "./TranslationPlanContent/ErrorDialog";
import { Box, DialogContent, DialogContentText, Grid2 } from "@mui/material";
import { doI18n } from "pithekos-lib";
import { useState } from "react";

export default function NewTranslationPlan() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          backgroundImage:
            'url("/app-resources/pages/content/background_blur.png")',
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(3px)",
        }}
      />
      <Header
        titleKey="pages:core-contenthandler_text_translation:title"
        currentId="core-contenthandler_text_translation"
        requireNet={false}
      />
      <PanDialog>
        <DialogContentText
          sx={{ ml: 1, p: 1 }}
          variant="subtitle2"
        ></DialogContentText>
        <DialogContent>
          <Grid2
            container
            spacing={2}
            justifyItems="flex-end"
            alignItems="stretch"
          >
            <PanBookPicker />
          </Grid2>
        </DialogContent>
        <PanDialogActions />
      </PanDialog>
      {/* Error Dialog */}
      <ErrorDialog
        setErrorDialogOpen={setErrorDialogOpen}
        errorDialogOpen={errorDialogOpen}
        errorMessage={errorMessage}
      />
    </Box>
  );
}
