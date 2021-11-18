var SELECTED_REGULATION = "";
var SELECTED_DEPARTMENT = "";
var SEMESTER_START = 1; 

$( document ).ready(function() {
    console.clear();
    showInfoMessage(MESSAGE_SITE_WELCOME);
    if (SITE_DEBUG) console.log("document loaded");

    $(ID_SITE_REG_SUBMIT_BUTTON).on('click', renderSemesterList);
});

function updateCGPA() {
    let total_sem_count = SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT].length;
    let sumOfGPA = 0;
    let sumOfGradeXCredits = 0;
    let sumOfCreditPoints = 0;
    for(let semID=SEMESTER_START-1; semID < total_sem_count; semID++){
        let total_sub_count = SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"].length;
        for(let subID=0; subID < total_sub_count; subID++){
            let gradePoint = $(`#sem-${semID}-sub-${subID}`).val();
            if(gradePoint === undefined || gradePoint === "0" || gradePoint === "none") continue;
            gradePoint = parseInt(gradePoint);
            let creditPoint = parseInt(SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"][subID]["credit_points"]);
            sumOfGradeXCredits = sumOfGradeXCredits + (creditPoint * gradePoint);
            sumOfCreditPoints = sumOfCreditPoints + creditPoint;
        }
    }
    if(sumOfCreditPoints === 0) return false;
    let cgpa = (sumOfGradeXCredits / sumOfCreditPoints).toFixed(2);
    $(`#cgpa`).val(cgpa);
}

function updateGPA(semID) {
    let subject_count = SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"].length;
    let sumOfGradeXCredits = 0;
    let sumOfCreditPoints = 0;
    for(let subID=0; subID < subject_count; subID++){
        gradePoint = $(`#sem-${semID}-sub-${subID}`).val();
        if(gradePoint === undefined || gradePoint === "0" || gradePoint === "none") continue;
        gradePoint = parseInt(gradePoint);
        creditPoint = parseInt(SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"][subID]["credit_points"]);
        sumOfGradeXCredits = sumOfGradeXCredits + (creditPoint * gradePoint);
        sumOfCreditPoints = sumOfCreditPoints + creditPoint;
    }
    if(sumOfCreditPoints === 0) return false;
    let gpa = (sumOfGradeXCredits / sumOfCreditPoints).toFixed(3);
    $(`#gpa-${semID}`).val(gpa);
    updateCGPA();
}

function selectSubject(subject_id) {
    showSubjectEmoji(subject_id);
    let semID = parseInt(subject_id[4]);
    updateGPA(semID);
}

function renderSemesterList() {
    console.clear();
    if(!validateRegDeptSelection()) return false;
    
    let semesterListCode = "";
    let total_sem_count = SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT].length;
    SEMESTER_START = 1;
    if($(`#islateral`).is(':checked')) SEMESTER_START = 3;
    for(let _sem=SEMESTER_START - 1; _sem < total_sem_count; _sem++){
        semesterListCode += `<fieldset class="semester" id="show-sem-${_sem}">`;
        semesterListCode += `<legend class="text-primary semester">Semester - ${_sem + 1}</legend>`;
        semesterListCode += generateSemesterWidget(_sem);
        semesterListCode += `
        <div class="row gpa-show">
            <div class="col-sm-2">
                <span class="text-success gpa-label">GPA</span>
            </div>
            <div class="col-sm-2">
                <input type="number" class="gpa-input" id="gpa-${_sem}" onChange="updateCGPA(this.value)"/>
            </div>
        </div>
        `;
        semesterListCode += `</fieldset>`;
    }
    $(ID_SITE_SEMESTER_LIST).html(semesterListCode);
    $("#cgpa-container").removeClass("invisible");
    showInfoMessage("Welcome", "info");
}

function generateSemesterWidget(semID) {
    let semesterCode = "";
    let total_subject_count = SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"].length;
    for(let _subject=0; _subject < total_subject_count; _subject++){
        if( (_subject + 1)%4 === 1) {
            if(_subject !== 0) semesterCode += "</div>";
            semesterCode += '<div class="row">';
        }
        semesterCode += generateSubjectWidget(semID, _subject);
    }
    semesterCode += "</div>";
    return semesterCode
}

function generateSubjectWidget(semID, subID) {
    return `
        <div class="col-sm-3 subject">
            <select id="sem-${semID}-sub-${subID}" class="form-select" title="${SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"][subID]["subject_description"]}" onChange="selectSubject(this.id)">
                <option value="none" selected>${SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][semID]["subjects"][subID]["subject_title"]}</option>
                ${GRADE_OPTIONS[SELECTED_REGULATION]}
            </select>
            <span id="emoji-sem-${semID}-sub-${subID}" class="emoji"></span>
        </div>
    `;   
}

function validateRegDeptSelection() {
    let regulation = $(ID_SITE_REGULATION).val();
    if(regulation === "none"){
        showInfoMessage(MESSAGE_ERROR_REG_SELECT, "error");
        return false;
    }
    if (SITE_DEBUG) console.log("reg : " + regulation);

    let department = $(ID_SITE_DEPARTMENT).val();
    if(department === "none"){
        showInfoMessage(MESSAGE_ERROR_DEPT_SELECT, "error");
        return false;
    }
    if(!SITE_DATA[regulation].hasOwnProperty(department)){
        showInfoMessage("This Department not yet added !!!", "warning");
        return false;
    }
    if (SITE_DEBUG) console.log("dept : " + department);
    SELECTED_REGULATION = regulation;
    SELECTED_DEPARTMENT = department;
    return true;
}

function selectLateral() {
    let isLateral = $(`#islateral`).is(':checked');
    if(isLateral === undefined) return false;
    console.log(isLateral);
    if(isLateral){
        $("#show-sem-0").removeClass("invisible");
        $("#show-sem-1").removeClass("invisible");
    }
    else {
        $("#show-sem-0").addClass("invisible");
        $("#show-sem-1").addClass("invisible");
    }
    
}

function showInfoMessage(message, type = "info"){
    $(ID_SITE_INFO).text(message);
    if(type==="info") $(ID_SITE_INFO).attr("class", "alert alert-info");
    if(type==="error") $(ID_SITE_INFO).attr("class", "alert alert-danger");
    if(type==="success") $(ID_SITE_INFO).attr("class", "alert alert-success");
    if(type==="warning") $(ID_SITE_INFO).attr("class", "alert alert-warning");
}

function showSubjectEmoji(subject_id) {
    let subjectGrade = $(`#${subject_id} option:selected`).text().trim();
    let emojiCode = getEmojiCode(subjectGrade)
    $(`#emoji-${subject_id}`).html(`&#x${emojiCode}`);
}

function getEmojiCode(subject_grade) {
    if(subject_grade === "S")   return GRADE_S_EMOJIS[Math.floor(Math.random()*GRADE_S_EMOJIS.length)];
    if(subject_grade === "A")   return GRADE_A_EMOJIS[Math.floor(Math.random()*GRADE_A_EMOJIS.length)];
    if(subject_grade === "B")   return GRADE_B_EMOJIS[Math.floor(Math.random()*GRADE_B_EMOJIS.length)];
    if(subject_grade === "C")   return GRADE_C_EMOJIS[Math.floor(Math.random()*GRADE_C_EMOJIS.length)];
    if(subject_grade === "D")   return GRADE_D_EMOJIS[Math.floor(Math.random()*GRADE_D_EMOJIS.length)];
    if(subject_grade === "E")   return GRADE_E_EMOJIS[Math.floor(Math.random()*GRADE_E_EMOJIS.length)];
    if(subject_grade === "U")   return GRADE_U_EMOJIS[Math.floor(Math.random()*GRADE_U_EMOJIS.length)];
    return GRADE_DEFAULT_EMOJIS[Math.floor(Math.random()*GRADE_DEFAULT_EMOJIS.length)];
}

function loadECETest() {
    var testECEString = "{\"#sem-0-sub-0\":\"7\",\"#sem-0-sub-1\":\"5\",\"#sem-0-sub-2\":\"5\",\"#sem-0-sub-3\":\"7\",\"#sem-0-sub-4\":\"6\",\"#sem-0-sub-5\":\"5\",\"#sem-0-sub-6\":\"8\",\"#sem-0-sub-7\":\"9\",\"#sem-0-sub-8\":\"8\",\"#sem-1-sub-0\":\"6\",\"#sem-1-sub-1\":\"5\",\"#sem-1-sub-2\":\"5\",\"#sem-1-sub-3\":\"5\",\"#sem-1-sub-4\":\"5\",\"#sem-1-sub-5\":\"6\",\"#sem-1-sub-6\":\"8\",\"#sem-1-sub-7\":\"9\",\"#sem-2-sub-0\":\"5\",\"#sem-2-sub-1\":\"6\",\"#sem-2-sub-2\":\"6\",\"#sem-2-sub-3\":\"5\",\"#sem-2-sub-4\":\"5\",\"#sem-2-sub-5\":\"6\",\"#sem-2-sub-6\":\"9\",\"#sem-2-sub-7\":\"10\",\"#sem-3-sub-0\":\"7\",\"#sem-3-sub-1\":\"5\",\"#sem-3-sub-2\":\"6\",\"#sem-3-sub-3\":\"5\",\"#sem-3-sub-4\":\"9\",\"#sem-3-sub-5\":\"5\",\"#sem-3-sub-6\":\"7\",\"#sem-3-sub-7\":\"8\",\"#sem-3-sub-8\":\"10\",\"#sem-4-sub-0\":\"5\",\"#sem-4-sub-1\":\"5\",\"#sem-4-sub-2\":\"5\",\"#sem-4-sub-3\":\"7\",\"#sem-4-sub-4\":\"5\",\"#sem-4-sub-5\":\"10\",\"#sem-4-sub-6\":\"9\",\"#sem-4-sub-7\":\"8\",\"#sem-5-sub-0\":\"7\",\"#sem-5-sub-1\":\"7\",\"#sem-5-sub-2\":\"5\",\"#sem-5-sub-3\":\"7\",\"#sem-5-sub-4\":\"5\",\"#sem-5-sub-5\":\"5\",\"#sem-5-sub-6\":\"8\",\"#sem-5-sub-7\":\"9\",\"#sem-5-sub-8\":\"9\",\"#sem-6-sub-0\":\"6\",\"#sem-6-sub-1\":\"6\",\"#sem-6-sub-2\":\"7\",\"#sem-6-sub-3\":\"6\",\"#sem-6-sub-4\":\"5\",\"#sem-6-sub-5\":\"7\",\"#sem-6-sub-6\":\"10\",\"#sem-6-sub-7\":\"10\",\"#sem-7-sub-0\":\"7\",\"#sem-7-sub-1\":\"8\",\"#sem-7-sub-2\":\"7\",\"#sem-7-sub-3\":\"8\",\"#sem-7-sub-4\":\"9\"}";
    var testECE = JSON.parse(testECEString);
    for (const [key, value] of Object.entries(testECE)) {
        console.log(key, value);
        $(key).val(value);
    }
    for(let i=0; i<8; i++){
        updateGPA(i);
    }
    updateCGPA();
}

function getTestData() {
    var testData = {};
    for(let i=0; i<8; i++) {
        for(let j=0; j<SITE_DATA[SELECTED_REGULATION][SELECTED_DEPARTMENT][i]["subjects"].length; j++ ){
            testData[`#sem-${i}-sub-${j}`] = $(`#sem-${i}-sub-${j}`).val();
        }
    }
    console.log(JSON.stringify(testData));
}