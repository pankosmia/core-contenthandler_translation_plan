import { JsonEditor } from "json-edit-react";
import { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import { getJson, postJson } from "pankosmia-lib/http";
import GraphiteTest from "../components/GraphiteTest";
import {
  debugContext,
  i18nContext,
  typographyContext,
  SpSpaPage,
} from "pankosmia-rcl";
import { Button } from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { enqueueSnackbar } from "notistack";

export default function TranslationPlanEditorMuncher({}) {
  const [data, setData] = useState({});
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  const { typographyRef } = useContext(typographyContext);
  const [unsavedData, setUnsavedData] = useState(false);

  let key = "git.door43.org/BurritoTruck/greek_sentence_plan";
  useEffect(() => {
    const doFetch = async () => {
      const planResponse = await getJson(
        `/api/burrito/ingredient/raw/${key}?ipath=plan.json`,
      );
      if (planResponse.ok) {
        const planJson = planResponse?.json ?? {};
        setData(planJson);
      } else {
        enqueueSnackbar(
          `${doI18n("pages:core-contenthandler_text_translation:content_creation_error", i18nRef.current)}: ${planResponse.status}`,
          { variant: "error" },
        );
        return;
      }
    };
    doFetch().then();
  }, [key]);

  const saveData = async () => {
    const payload = JSON.stringify({ payload: JSON.stringify(data) });
    const response = await postJson(
      `/api/burrito/ingredient/raw/${key}?ipath=plan.json`,
      payload,
      debugRef.current,
    );
    if (response.ok) {
      enqueueSnackbar(
        `${doI18n("pages:core-local-workspace:saved", i18nRef.current)}`,
        { variant: "success" },
      );
      setUnsavedData(false);
    } else {
      enqueueSnackbar(
        `${doI18n("pages:core-local-workspace:save_error", i18nRef.current)}: ${response.status}`,
        { variant: "error" },
      );
    }
  };
  const restrictEditFilter = ({ value }) => typeof value !== "string";

  const restrictAddFilter = ({ value }) =>
    value &&
    (typeof value !== "object" ||
      Object.values(value).filter((o) => typeof o !== "string").length > 0);

  const restrictDeleteFilter = ({ value, parentData }) =>
    typeof value !== "string" || Object.keys(parentData).length === 1;

  const isGraphite = GraphiteTest();
  /** adjSelectedFontClass reshapes selectedFontClass if Graphite is absent. */
  const adjSelectedFontClass = isGraphite
    ? typographyRef.current.font_set
    : typographyRef.current.font_set.replace(
        /Pankosmia-AwamiNastaliq(.*)Pankosmia-NotoNastaliqUrdu/gi,
        "Pankosmia-NotoNastaliqUrdu",
      );
  const panksomsiaTheme = {
    styles: {
      container: {
        padding: "0 16px 0 48px",
        backgroundColor: "inherited",
        fontFamily: "",
        fontSize: "xx-large",
        color: "#441650",
      },
      property: "#441650",
      string: "#000",
      bracket: { display: "none" },
      collection: { fontSize: "smaller", color: "#441650" },
      iconCollection: "#441650",
      iconEdit: "#441650",
      iconDelete: "#AA0000",
      iconAdd: "#441650",
      iconCopy: "#441650",
      iconOk: "#441650",
      iconCancel: "#AA0000",
      input: ["#000", { fontSize: "100%" }],
      inputHighlight: "#EECCFF",
    },
  };

  return (
    <SpSpaPage
      requireNet={false}
      titleKey="Translation plan editor"
      currentId="i18n-editor"
    >
      <Box
        sx={{
          mb: 2,
          position: "fixed",
          top: "64px",
          bottom: 0,
          right: 0,
          overflow: "auto",
          width: "100%",
        }}
        className={adjSelectedFontClass}
      >
        <JsonEditor
          data={data}
          rootName={data?.short_name}
          setData={setData}
          onUpdate={() => setUnsavedData(true)}
          //theme={panksomsiaTheme}
          restrictEdit={restrictEditFilter}
          restrictAdd={restrictAddFilter}
          restrictDelete={restrictDeleteFilter}
          maxHeight="100%"
          maxWidth="100%"
          showCollectionCount="when-closed"
        />
      </Box>
      <Button
        sx={{
          color: unsavedData ? "#FFF" : "#AAA",
          ml: 2,
          position: "absolute",
          top: "64px",
          right: "50px",
        }}
        color="secondary"
        size="large"
        variant="contained"
        aria-label="save"
        disabled={!unsavedData}
        onClick={() => {
          saveData();
        }}
      >
        {doI18n("pages:i18n-editor:save_button", i18nRef.current)}
      </Button>
    </SpSpaPage>
  );
}
