import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  debugContext,
  Header,
  PanStepperPicker,
} from "pankosmia-rcl";
import ErrorDialog from "./TranslationPlanContent/ErrorDialog";
import { Box, DialogContent } from "@mui/material";
import { doI18n, postJson } from "pithekos-lib";
import { useContext, useState } from "react";
import ContentDocument from "./TranslationPlanContent/ContentDocument";
import LanguagePicker from "./TranslationPlanContent/LanguagePicker";
import NameDocument from "./TranslationPlanContent/NameDocument";

export default function NewTranslationPlan() {
  const [open, setOpen] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { i18nRef } = useContext(i18nContext);
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const typePageQuery = new URLSearchParams(query[1]);
  const returnType = typePageQuery.get("returnTypePage");
  const { debugRef } = useContext(debugContext);
  const [contentName, setContentName] = useState("");
  const [contentAbbr, setContentAbbr] = useState("");
  const [contentType, setContentType] = useState("text_translation");
  const [contentOption, setContentOption] = useState("greekSentences");
  const [postCount, setPostCount] = useState();
  const [showVersification, setShowVersification] = useState(true);
  const [versification, setVersification] = useState("eng");
  const [localRepos, setLocalRepos] = useState([]);
  const [repoExists, setRepoExists] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({
    language_code: "",
    language_name: "",
  });
  const [languageIsValid, setLanguageIsValid] = useState(true);
  const [errorAbbreviation, setErrorAbbreviation] = useState(false);

  const steps = [
    `${doI18n("pages:core-contenthandler_text_translation:name_section", i18nRef.current)}`,
    `${doI18n("pages:core-contenthandler_text_translation:language", i18nRef.current)}`,
    `${doI18n("pages:core-contenthandler_text_translation:content_section", i18nRef.current)}`,
  ];

  const handleClose = () => {
    setOpen(false);
    if (returnType === "dashboard") {
      setTimeout(() => {
        window.location.href = "/clients/main";
      });
    } else {
      setTimeout(() => {
        window.location.href = "/clients/content";
      });
    }
  };
  const handleCreate = async () => {
    // Make repo (empty for plans)
    const payload = {
      content_name: contentName,
      content_abbr: contentAbbr,
      content_type: contentType,
      content_language_code: currentLanguage.language_code,
      content_language_name: currentLanguage.language_name,
      versification: versification,
    };

    const response = await postJson(
      "/git/new-translation-plan",
      JSON.stringify(payload),
      debugRef.current,
    );
    if (response.ok) {
      setPostCount(postCount + 1);
    } else {
      setErrorMessage(
        `${doI18n("pages:core-contenthandler_text_translation:book_creation_error", i18nRef.current)}: ${
          response.status
        }`,
      );
      setErrorDialogOpen(true);
      return;
    }
  };
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <NameDocument
            contentType={contentType}
            setContentType={setContentType}
            repoExists={repoExists}
            setRepoExists={setRepoExists}
            contentName={contentName}
            setContentName={setContentName}
            contentAbbr={contentAbbr}
            setContentAbbr={setContentAbbr}
            errorAbbreviation={errorAbbreviation}
            setErrorAbbreviation={setErrorAbbreviation}
            localRepos={localRepos}
          />
        );
      case 1:
        return (
          <LanguagePicker
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
            setIsValid={setLanguageIsValid}
          />
        );
      case 2:
        return (
          <ContentDocument
            open={open}
            contentOption={contentOption}
            setContentOption={setContentOption}
            versification={versification}
            setVersification={setVersification}
            showVersification={showVersification}
            setShowVersification={setShowVersification}
          />
        );
      default:
        return null;
    }
  };
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return (
          contentName.trim().length > 0 &&
          contentAbbr.trim().length > 0 &&
          contentType.trim().length > 0 &&
          errorAbbreviation === false &&
          repoExists === false
        );

      case 1:
        return (
          currentLanguage?.language_code?.trim().length > 0 &&
          currentLanguage?.language_name?.trim().length > 0 &&
          languageIsValid === true
        );
      case 2:
        return true;
      default:
        return true;
    }
  };
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
      <PanDialog
        titleLabel={"blabla"}
        isOpen={open}
        closeFn={() => handleClose()}
      >
        <DialogContent>
          <PanStepperPicker
            steps={steps}
            renderStepContent={renderStepContent}
            isStepValid={isStepValid}
            handleCreate={handleCreate}
            handleClose={handleClose}
          />
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
