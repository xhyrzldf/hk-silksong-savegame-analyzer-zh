!macro preInit
  StrCpy $INSTDIR "$PROGRAMFILES\Silksong Savegame Analyzer"
  IfFileExists "D:\\*.*" 0 +2
    StrCpy $INSTDIR "D:\\Silksong Savegame Analyzer"
!macroend
