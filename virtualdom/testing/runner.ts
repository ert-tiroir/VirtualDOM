import { testAppendChild, testCircularAppend, testCreateVirtualNode } from "./cases/node.js";

const testcases = [
    testCreateVirtualNode,
    testAppendChild,
    testCircularAppend
];

export function runAllTestCases () {
    let valid = 0;
    let wrong = 0;
    let error = 0;

    for (let testcase of testcases) {
        try {
            if (testcase()) valid ++;
            else wrong ++;
        } catch (e) {
            console.error(e);
            error ++;
        }
    }

    console.log("OK: ", valid, "WRONG: ", wrong, "ERROR: ", error);
}
