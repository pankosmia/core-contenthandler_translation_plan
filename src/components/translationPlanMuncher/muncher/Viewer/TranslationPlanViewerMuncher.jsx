import { useEffect, useState, useRef } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { getText, postEmpty } from "pankosmia-lib/http";

import InfoIcon from "@mui/icons-material/Info";
import TextDir from "../helpers/TextDir";
import ExtractJsonValues from "../helpers/ExtractJsonValues";
import InformationDialog from "./ViewerTools/InformationDialog";
import processUsfm from "./ViewerTools/processUsfm";
import ScripturePicker from "./ViewerTools/ScripturePicker";
import ScriptureField from "./ViewerTools/ScriptureField";
import NonScriptureField from "./ViewerTools/NonScriptureField";
import JumpButton from "./ViewerTools/JumpButton";
import SectionReference from "./ViewerTools/SectionReference";

function TranslationPlanViewerMuncher({
  metadata,
  debugRef,
  systemBcv,
  i18nRef,
  typographyRef,
}) {
  const [planIngredient, setPlanIngredient] = useState();
  const [verseText, setVerseText] = useState({});
  const [burritos, setBurritos] = useState([]);
  const [selectedBurrito, setSelectedBurrito] = useState(null);
  const [selectedSection, setSelectedSection] = useState();
  const [textDir, setTextDir] = useState(
    metadata?.script_direction
      ? metadata.script_direction.toLowerCase()
      : undefined,
  );

  const [selectedBurritoSbTextDir, setSelectedBurritoSbTextDir] =
    useState(undefined);
  const [selectedBurritoTextDir, setSelectedBurritoTextDir] =
    useState(undefined);
  const [openDialogAbout, setOpenDialogAbout] = useState(false);
  const sectionTopRef = useRef(null);
  const graftRefs = useRef({});
  const pendingGraftIdxRef = useRef(null);
  const suppressVerseScrollRef = useRef(false);
  const [verseScrollTrigger, setVerseScrollTrigger] = useState(0);

  const sbScriptDir = metadata?.script_direction
    ? metadata.script_direction.toLowerCase()
    : undefined;
  const sbScriptDirSet = sbScriptDir === "ltr" || sbScriptDir === "rtl";

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const handleOpenDialogAbout = () => {
    setOpenDialogAbout(true);
  };
  useEffect(() => {
    const getChapterText = async () => {
      if (!selectedBurrito || !systemBcv?.bookCode) {
        return;
      }
      try {
        const url = `/api/burrito/ingredient/raw/${selectedBurrito.path}?ipath=${systemBcv.bookCode}.usfm`;
        const usfmResponse = await getText(url, debugRef.current);

        if (usfmResponse?.ok) {
          const newVerseText = processUsfm(usfmResponse.text);
          setVerseText(newVerseText);
        } else {
          setVerseText({});
        }
      } catch (error) {
        console.error(error);
      }
    };
    getChapterText();
  }, [systemBcv.bookCode, selectedBurrito]);

  useEffect(() => {
    async function fetchSummaries() {
      try {
        const response = await fetch("/api/burrito/metadata/summaries");
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        // Filter only those with flavor_type = scripture
        const burritoArray = Object.entries(data).map(([key, value]) => ({
          path: key,
          ...value,
        }));

        // Filter only scripture burritos
        const scriptures = burritoArray.filter(
          (item) => item?.flavor === "textTranslation",
        );
        setBurritos(scriptures);
      } catch (err) {
        console.error("Error fetching summaries:", err);
      }
    }

    fetchSummaries();
  }, []);

  useEffect(() => {
    if (selectedBurrito !== null) {
      setSelectedBurritoSbTextDir(
        selectedBurrito?.script_direction
          ? selectedBurrito.script_direction.toLowerCase()
          : undefined,
      );
      setSelectedBurritoTextDir(
        selectedBurrito?.script_direction
          ? selectedBurrito.script_direction.toLowerCase()
          : undefined,
      );
    }
  }, [selectedBurrito]);

  useEffect(() => {
    async function loadCSS() {
      const url =
        selectedBurritoTextDir === "ltr"
          ? "/api/app-resources/usfm/bible_page_styles.css"
          : "/api/app-resources/usfm/bible_page_styles_rtl.css";
      const response = await fetch(url);
      if (!response.ok) {
        console.error(response.status);
        return;
      }
      const cssText = await response.text();
      const style = document.createElement("style");
      style.textContent = cssText;
      document.head.appendChild(style);
    }

    loadCSS().then();
  }, [selectedBurritoTextDir]);

  useEffect(() => {
    const getAllData = async () => {
      const ingredientLink = `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=plan.json`;
      const response = await fetch(ingredientLink);
      if (response.ok) {
        const data = await response.json();
        setPlanIngredient(data);
        const planText = ExtractJsonValues(data, [
          "name",
          "description",
          "sectionTitle",
          "themeBody",
          "principle",
          "principleMore",
        ])
          .toString()
          .replace(/,/g, "");
        if (!sbScriptDirSet) {
          const dir = await TextDir(planText.toString(), "text");
          setTextDir(dir);
        }
      } else {
        setPlanIngredient({});
      }
    };
    getAllData().then();
  }, [sbScriptDirSet, metadata.local_path]);

  const isInInterval = (section, systemBcv) => {
    const [startChapter, startVerse] = section.cv[0].split(":").map(Number);
    const [endChapter, endVerse] = section.cv[1].split(":").map(Number);
    const chapterNum = systemBcv.chapterNum;
    const verseNum = systemBcv.verseNum;
    const endVerseNum = systemBcv.endVerseNum || systemBcv.verseNum;

    if (
      chapterNum < startChapter ||
      (chapterNum === startChapter && endVerseNum < startVerse)
    )
      return false;
    if (
      chapterNum > endChapter ||
      (chapterNum === endChapter && verseNum > endVerse)
    )
      return false;
    return true;
  };

  const section = planIngredient?.sections?.find(
    (section) =>
      section.bookCode === systemBcv.bookCode &&
      isInInterval(section, systemBcv),
  );

  const sectionId = section ? `${section.bookCode}-${section.cv[0]}` : null;

  const scrollToGraft = (graftIdx) => {
    if (graftIdx <= 0) {
      if (sectionTopRef.current) {
        sectionTopRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else if (graftRefs.current[graftIdx]) {
      graftRefs.current[graftIdx].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (sectionTopRef.current) {
      sectionTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (sectionTopRef.current) {
      const pendingIdx = pendingGraftIdxRef.current;
      pendingGraftIdxRef.current = null;
      if (
        pendingIdx != null &&
        pendingIdx > 0 &&
        graftRefs.current[pendingIdx]
      ) {
        graftRefs.current[pendingIdx].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        sectionTopRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [sectionId, selectedBurrito]);

  useEffect(() => {
    const handleEditorInteraction = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const verseSpan = target.closest(".span_edit_verses");
      const verseLabel = target.closest(".marks_verses_label");
      if (verseSpan || verseLabel) {
        suppressVerseScrollRef.current = false;
        const labelEl = verseLabel || verseSpan?.previousElementSibling;
        const clickedVerse = Number(
          labelEl?.textContent?.trim()?.split("-")[0],
        );
        if (!clickedVerse || clickedVerse === Number(systemBcv?.verseNum)) {
          setVerseScrollTrigger((c) => c + 1);
        }
        return;
      }

      const blockDiv = target.closest("div");
      const graftSpan =
        target.closest(".span_edit_graft") ||
        blockDiv?.querySelector?.(":scope > .span_edit_graft");

      const isRemarkBlock =
        !graftSpan &&
        blockDiv &&
        blockDiv.firstElementChild?.tagName === "SPAN" &&
        blockDiv.firstElementChild?.textContent?.trim() === "//";

      if (!graftSpan && !isRemarkBlock) return;

      const blockEl = graftSpan ? graftSpan.parentElement : blockDiv;
      if (!blockEl) return;

      let graftIdx = isRemarkBlock ? -1 : 0;
      let prev = blockEl.previousElementSibling;
      while (prev && prev.querySelector?.(".span_edit_graft")) {
        if (!isRemarkBlock) graftIdx++;
        prev = prev.previousElementSibling;
      }

      let nextEl = blockEl.nextElementSibling;
      let nextVerseStr = null;
      while (nextEl) {
        const vLabel = nextEl.querySelector?.(".marks_verses_label");
        if (vLabel?.textContent) {
          nextVerseStr = vLabel.textContent.trim();
          break;
        }
        nextEl = nextEl.nextElementSibling;
      }

      if (nextVerseStr && systemBcv?.bookCode && systemBcv?.chapterNum) {
        const v = nextVerseStr.includes("-")
          ? nextVerseStr.split("-")[0]
          : nextVerseStr;
        const ev = nextVerseStr.includes("-")
          ? nextVerseStr.split("-")[1]
          : nextVerseStr;
        const targetBcv = {
          bookCode: systemBcv.bookCode,
          chapterNum: Number(systemBcv.chapterNum),
          verseNum: Number(v),
          endVerseNum: Number(ev),
        };
        const changingSection = section && !isInInterval(section, targetBcv);
        if (changingSection) {
          pendingGraftIdxRef.current = graftIdx;
        }
        if (
          changingSection ||
          Number(systemBcv?.verseNum) !== targetBcv.verseNum
        ) {
          suppressVerseScrollRef.current = true;
          postEmpty(
            `/api/navigation/bcv/${targetBcv.bookCode}/${targetBcv.chapterNum}/${v}/${ev}`,
            debugRef?.current,
          );
          if (changingSection) {
            return;
          }
        }
      }

      scrollToGraft(graftIdx);
    };

    document.addEventListener("click", handleEditorInteraction);
    return () => document.removeEventListener("click", handleEditorInteraction);
  });

  if (!planIngredient) {
    return <Typography> loading...</Typography>;
  }

  let graftCounter = 0;
  graftRefs.current = {};

  // If SB does not specify direction then it is set here, otherwise it has already been set per SB in WorkspaceCard
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
      dir={!sbScriptDirSet ? textDir : undefined}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          position: "sticky",
          top: 0,
          zIndex: 2,
          paddingTop: "10px",
          paddingBottom: "8px",
          backgroundColor: theme.palette.background.paper,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ScripturePicker
            burritos={burritos}
            selectedBurrito={selectedBurrito}
            setSelectedBurrito={setSelectedBurrito}
            i18nRef={i18nRef}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <JumpButton
            planIngredient={planIngredient}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            open={open}
            i18nRef={i18nRef}
            debugRef={debugRef}
          />
          <IconButton onClick={handleOpenDialogAbout}>
            <InfoIcon />
          </IconButton>
        </Box>
      </Box>
      <Box>
        {selectedBurrito && (
          <>
            {section && (
              <Box
                ref={sectionTopRef}
                sx={{ padding: 1, scrollMarginTop: "64px" }}
              >
                <SectionReference section={section} />
                {planIngredient.sectionStructure.map((field, i) => {
                  if (field.type === "scripture") {
                    return (
                      <ScriptureField
                        key={i}
                        section={section}
                        verseText={verseText}
                        systemBcv={systemBcv}
                        selectedBurritoTextDir={selectedBurritoTextDir}
                        verseScrollTrigger={verseScrollTrigger}
                        suppressVerseScrollRef={suppressVerseScrollRef}
                      />
                    );
                  } else {
                    const hasValue = Boolean(
                      section.fieldInitialValues?.[field.name] ||
                      planIngredient.fieldInitialValues?.[field.name],
                    );
                    if (!hasValue) return null;
                    const currentGraftIdx = graftCounter++;
                    return (
                      <div
                        key={i}
                        ref={(el) => {
                          graftRefs.current[currentGraftIdx] = el;
                        }}
                        style={{ scrollMarginTop: "48px" }}
                      >
                        <NonScriptureField
                          planIngredient={planIngredient}
                          section={section}
                          field={field}
                          typographyRef={typographyRef}
                        />
                      </div>
                    );
                  }
                })}
              </Box>
            )}
            {!section && <Typography> no section found </Typography>}
          </>
        )}
      </Box>
      <InformationDialog
        planIngredient={planIngredient}
        openDialogAbout={openDialogAbout}
        setOpenDialogAbout={setOpenDialogAbout}
        i18nRef={i18nRef}
      />
    </Box>
  );
}

export default TranslationPlanViewerMuncher;
