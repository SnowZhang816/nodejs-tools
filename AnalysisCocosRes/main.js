const args = process.argv.slice(2);
const { analysis } = require("./analysis.js")

let analysisPath = 'D:\\work\\casualslots\\build\\web-mobile\\assets'
if (args[0]) {
	analysisPath = args[0]
}

/**
 * 主函数，用于执行主要逻辑
 *
 * @param destPath 目标路径，用于存放分析结果
 */
function main(destPath) {
	analysis.analysis(destPath)

	analysis.exportsAssets("./out")
}

main(analysisPath)