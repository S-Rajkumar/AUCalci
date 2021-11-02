const SITE_DEBUG = true;

const ID_SITE_INFO = "#info";
const ID_SITE_REG_SUBMIT_BUTTON = "#reg-submit";
const ID_SITE_SEMESTER_LIST = "#semesterlist";
const ID_SITE_REGULATION = "#regulation";
const ID_SITE_DEPARTMENT = "#department";

const MESSAGE_SITE_WELCOME = "Welcome";
const MESSAGE_ERROR_REG_SELECT = "Please select regulation to continue...";
const MESSAGE_ERROR_DEPT_SELECT = "Please select department to continue...";

const GRADE_S_EMOJIS = ["1F911", "1F973", "1F978", "1F913", "1F9E0", "1F490", "1F947", "1F3C6", "1F393", "1F4DA"];
const GRADE_A_EMOJIS = ["1F607", "1F60E", "1F44C", "1F4AA", "1F339", "1F948", "1F3AF", "1F4B0"];
const GRADE_B_EMOJIS = ["1F596", "1F919", "1F44F", "2B50", "1F949", "1F603", "1F920"];
const GRADE_C_EMOJIS = ["1F642", "1F44D", "1F31E", "1F643"];
const GRADE_D_EMOJIS = ["1F610", "1F641", "1F31D", "1F917"];
const GRADE_E_EMOJIS = ["1F92D", "1F910", "1F922", "1F974", "1F611", "1F999", "1F60F"];
const GRADE_U_EMOJIS = ["1F972", "1F92E", "1F975", "1F621", "1F64F", "1F437", "1F614"];
const GRADE_DEFAULT_EMOJIS = ["1F644", "1F971", "1F914"];

const GRADE_OPTIONS = {
    "reg-2013": `
        <option value="10">S</option>
        <option value="9">A</option>
        <option value="8">B</option>
        <option value="7">C</option>
        <option value="6">D</option>
        <option value="5">E</option>
        <option value="0">U</option>
    `,
    "reg-2017": `
    <option value="10">O</option>
    <option value="9">A+</option>
    <option value="8">A</option>
    <option value="7">B+</option>
    <option value="6">B</option>
    <option value="5">C</option>
    <option value="0">U</option>
    `
}