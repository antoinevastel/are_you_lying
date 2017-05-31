var fontsToTest = ['WenQuanYi Zen Hei Sharp', 'HGP?????M', 'Yuanti TC', 'Verdana Gras', 'Noto Sans Emoji', 'Ume Mincho', 'AR PL UMing TW', 'NewJumja', 'Ume Gothic O5', 'Blackletter686 BT', 'Latin Modern Sans', 'Verdana Italique', 'Marigold', 'HGS???', 'esint10', 'ParkAvenue BT', 'Latin Modern Mono Prop Light', 'Police système Italique', 'Princetown LET', 'Nimbus Sans Narrow', 'Latin Modern Roman Caps', 'Khmer OS Content', 'Latin Modern Mono Slanted', 'Rage Italic LET', 'IV50', 'Police système Courant', 'ITF Devanagari Marathi', 'Arial Narrow Italique', 'BRK', 'AR PL UMing HK', 'Tsukushi B Round Gothic', 'Synchro LET', 'Latin Modern Roman Dunhill', 'TG Pagella Math', 'HG????-PRO', 'Bodoni 72 Oldstyle', 'Police système Intense', 'Bickham Script Pro Regular', 'Cataneo BT', 'Laksaman', 'Gabo Drive', '?????W7', 'ori1Uni', 'TSCu', 'Ume P Mincho S3', 'Arial monospaced for SAP', 'Ostrich Sans Heavy', 'msbm10', 'eufm10', 'Arial Narrow Gras Italique', 'HG??????M-PRO', '??', 'Calligraph421 BT', 'Ume P Gothic S5', 'HG?????????', 'Police système Semi-gras', 'HCR Dotum', 'HolidayPi BT', 'HGS????', 'Orange LET', 'Microsoft Yahei', 'Brush Script MT Italique', 'HG??B', 'Georgia Gras Italique', 'Times Gras', 'Ume Gothic', 'HGS??B', 'HGS????????UB', 'SAPDings', 'Staccato222 BT', 'Comic Sans MS Gras', 'Police système', 'La Bamba LET', 'Latin Modern Mono Caps', 'Clarendon', 'Courier New Gras', 'MotoyaG04Gothic', 'Bodoni 72 Smallcaps', '?? ?????', 'Times New Roman Gras Italique', 'Arial Gras Italique', 'rsfs10', 'Oxygen-Sans', 'Letter Gothic', 'Kievit Offc Pro', 'Apple Emoji couleur', '???', 'Trebuchet MS Italique', 'HyhwpEQ', 'Hiragino Sans', 'Times New Roman Italique', 'MSung GB18030', 'HGS??E', 'Courier New Gras Italique', 'Ume P Gothic S4', 'Ume P Gothic', 'Bradley Hand', 'CL', 'Garamond Premr Pro', 'Earth', 'Courier New Italique', 'HGS?????????', 'PingFang TC', 'IV25', 'Ume P Gothic C4', 'Enigmatic Unicode', 'Bell Gothic Std Light', 'Tiranti Solid LET', 'Mekanik LET', '?? ????', 'P', '??-? ??', 'Albertus Medium', 'Ume Gothic S5', '????????? ????? ??????', '?? ???', 'msam10', 'URW Gothic', 'Verdana Gras Italique', 'Droid Sans Devanagari', 'Trebuchet MS Gras', 'Wolf', 'Milano LET', 'Latin Modern Roman Slanted', 'HGP???', 'HGP?????E', 'Montserrat SemiBold', 'SignPainter', 'Police système Léger', 'HG???', 'HG????????UB', 'HG????', 'SchoolHouse Printed A', 'HGP????????UB', 'SchoolHouse Cursive B', 'Ume UI Gothic O5', 'Latin Modern Mono Light', 'Latin Modern Mono', 'Latin Modern Sans Quotation', 'TAMu', 'PingFang HK', 'Tlwg Typewriter', 'Ume P Mincho', 'Eeyek Unicode', 'Latin Modern Roman Unslanted', 'John Handy LET', 'Roman SD', 'Helvetica Gras', 'Bordeaux Roman Bold LET', 'HCR Batang', 'MSung B5HK', 'Quixley LET', 'HG?????M', 'Latin Modern Mono Prop', 'Ruach LET', 'Kohinoor Devanagari', 'Ume UI Gothic', 'Nuosu SIL', 'AR PL UMing TW MBE', 'Phosphate', 'Arial Narrow Gras', 'Arial Black Normal', 'Latin Modern Roman Demi', 'Ume P Gothic C5', 'Charlie', 'Georgia Gras', 'University Roman LET', 'ITF Devanagari', 'HGP?????????', 'HGS?????????EB', 'Arial Italique', 'Police système Gras', 'Ume Mincho S3', 'Virgo 01', 'stmary10', 'FixedSys', 'Scruff LET', 'Fixed', 'HGP?????????EB', 'Georgia Italique', 'HGP????', 'Ki', 'MotoyaG04Mincho', 'Courier Gras', 'HG?????????EB', 'HGP??E', 'HGP??B', '12x10', 'Coronet', 'Times Gras italique', 'boot', 'HGS?????M', 'cursor', 'Tlwg Mono', '36p Kana', 'Ume Gothic S4', 'Arial Gras', 'Times New Roman Gras', 'HG?????E', 'Bradley Hand Gras', 'Thonburi Gras', 'Westwood LET', 'Trebuchet MS Gras Italique', 'Broadway BT', 'Pump Demi Bold LET', 'Tsukushi A Round Gothic', '?????????', 'Klee', 'HG??E', '????????? ????? ???????', 'Mishafi Gold', 'Lohit Odia', 'Smudger LET', 'IPT', 'Latin Modern Mono Light Cond', 'TG Termes Math', 'HGS?????E', 'Ume P Gothic O5', 'MisterEarl BT', 'AR PL UMing CN', 'Times Italique', 'PakType Naqsh', 'OldDreadfulNo7 BT', 'Lohit Gurmukhi', 'Ro', 'Odessa LET', 'Bodoni 72', 'PingFang SC', 'Latin Modern Sans Demi Cond', 'One Stroke Script LET', 'Highlight LET', 'pcf', 'W', 'Ume Gothic C5', 'wasy10', 'SWMacro', 'WST', 'Victorian LET', 'Latin Modern Roman', '?? ??', 'Tahoma Gras', 'Mona Lisa Solid ITC TT', 'SAPIcons', 'Police système Moyen', 'MotoyaG04GothicMono', 'Ume Gothic C4', '??-? ???', 'MotoyaG04MinchoMono'];