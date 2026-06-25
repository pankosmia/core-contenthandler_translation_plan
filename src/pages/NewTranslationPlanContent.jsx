import {
  PanDialog,
  i18nContext,
  debugContext,
  Header,
  PanStepperPicker,
} from "pankosmia-rcl";
import ErrorDialog from "./TranslationPlanContent/ErrorDialog";
import { Box, DialogContent } from "@mui/material";
import { getAndSetJson, getJson, postJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { useContext, useEffect, useState } from "react";
import ContentDocument from "./TranslationPlanContent/ContentDocument";
import LanguagePicker from "./TranslationPlanContent/LanguagePicker";
import NameDocument from "./TranslationPlanContent/NameDocument";

export default function NewTranslationPlan() {
  const { i18nRef } = useContext(i18nContext);
  const [open, setOpen] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const typePageQuery = new URLSearchParams(query[1]);
  const returnType = typePageQuery.get("returnTypePage");
  const { debugRef } = useContext(debugContext);
  const [contentName, setContentName] = useState("");
  const [contentAbbr, setContentAbbr] = useState("");
  const [contentType, setContentType] = useState("text_translation");
  const [contentOption, setContentOption] = useState("bcv");
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
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [copyright, setCopyright] = useState({
    author_name: "",
    year: "",
  });
  const [optionCopyright, setOptionCopyright] = useState("all_rights_reserved");
  const fullCopyright =
    optionCopyright !== "public-domain"
      ? `${copyright.author_name} ${copyright.year}`
      : `${doI18n(
          "pages:core-contenthandler_translation_plan:public_domain",
          i18nRef.current,
        )}`;

  const steps = [
    `${doI18n("pages:core-contenthandler_text_translation:content_section", i18nRef.current)}`,
    `${doI18n("pages:core-contenthandler_text_translation:language", i18nRef.current)}`,
    `${doI18n("pages:core-contenthandler_translation_plan:properties", i18nRef.current)}`,
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
  useEffect(() => {
    if (open) {
      getAndSetJson({
        url: "/api/git/list-local-repos",
        setter: setLocalRepos,
      }).then();
    }
  }, [open]);
  const handleCreate = async () => {
    // Make repo (empty for plans)
    let planJson = null;
    let submittedVersification = versification;
    if (contentOption === "plan" && selectedPlan) {
      const planResponse = await getJson(
        `/api/burrito/ingredient/raw/${selectedPlan}?ipath=plan.json`,
        debugRef.current,
      );
      if (planResponse.ok) {
        planJson = planResponse.json;
        submittedVersification = planJson.versification;
      } else {
        setErrorMessage(
          `${doI18n("pages:core-contenthandler_text_translation:content_creation_error", i18nRef.current)}: ${planResponse.status}`,
        );
        setErrorDialogOpen(true);
        return;
      }
    }
    const payload = {
      content_name: contentName,
      content_abbr: contentAbbr,
      content_language_code: currentLanguage.language_code,
      content_language_name: currentLanguage.language_name,
      versification: submittedVersification,
      plan: planJson && JSON.stringify(planJson),
      copyright: fullCopyright,
    };
    const response = await postJson(
      "/api/git/new-translation-plan-resource",
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
    await handleClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ContentDocument
            open={open}
            contentOption={contentOption}
            setContentOption={setContentOption}
            versification={versification}
            setVersification={setVersification}
            showVersification={showVersification}
            setShowVersification={setShowVersification}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
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
            copyright={copyright}
            setCopyright={setCopyright}
            optionCopyright={optionCopyright}
            setOptionCopyright={setOptionCopyright}
          />
        );
      default:
        return null;
    }
  };
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        if (contentOption === "plan") {
          return versification.trim().length === 3 && Boolean(selectedPlan);
        }
        return true;

      case 1:
        return (
          currentLanguage?.language_code?.trim().length > 0 &&
          currentLanguage?.language_name?.trim().length > 0 &&
          languageIsValid === true
        );
      case 2:
        return (
          contentName.trim().length > 0 &&
          contentAbbr.trim().length > 0 &&
          contentType.trim().length > 0 &&
          errorAbbreviation === false &&
          repoExists === false
        );
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
            'url("/api/app-resources/pages/content/background_blur.png")',
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(3px)",
        }}
      />
      <Header
        titleKey={
          returnType === "dashboard"
            ? "pages:core-dashboard:title"
            : "pages:content:title"
        }
        currentId="core-contenthandler_text_translation"
        requireNet={false}
      />
      <PanDialog
        titleLabel={`${doI18n("pages:core-contenthandler_translation_plan:new_translation_plan", i18nRef.current)}`}
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
            requiredFieldsLabel
          />
        </DialogContent>
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
