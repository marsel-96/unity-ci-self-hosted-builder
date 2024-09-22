import * as core from '@actions/core'
import * as logging from "unity-ci-self-hosted-common/dist";
import { runCommand } from "unity-ci-self-hosted-common/dist";
import { join } from 'path'
import { variables } from './input'
import { writeFile } from 'fs/promises'


/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    
    console.log(`--------------------------------------------------------------------`)
    logging.logWithStyle('Starting Unity Build', logging.ForegroundColor.Cyan)
    console.log(`--------------------------------------------------------------------`)

    const unityBuildFullPath = variables.unityBuildPath.value
    const command = variables.UNITY_PATH.value
    const args = [
      "-quit",
      "-batchmode",
      "-nographics",
      "-silent-crashes",
      "-executeMethod", variables.unityBuildMethod.value,
      "-customBuildName", variables.unityBuildName.value,
      "-buildTarget", variables.unityBuildTarget.value,
      "-customBuildTarget", variables.unityBuildTarget.value,
      "-buildVersion", variables.unityBuildVersion.value,
      "-projectPath", variables.unityProjectPath.value,
      "-customBuildPath", unityBuildFullPath,
      "-logfile -"
    ]

    if (variables.unityCustomArguments.value) {
      args.push(variables.unityCustomArguments.value)
    }
    
    let exitCode

    try {
      core.startGroup('Running Unity Command')
      exitCode = await runCommand(command, args)
      core.endGroup()
    } catch(error){
      core.endGroup()
      throw new Error('Exception while running unity command', {cause: error});
    }

    if (exitCode === 0) {

      console.log(`--------------------------------------------------------------------`)
      logging.logWithStyle('Build Succeeded!', logging.ForegroundColor.Green)
      console.log(`--------------------------------------------------------------------`)
  
      console.log(`Writing version to version.md`)

      const versionFile = join(unityBuildFullPath, 'version.md')
      const versionFileContent = 
        `Name: ${variables.unityBuildName.value}\n` +
        `Version: ${variables.unityBuildVersion.value}\n` +
        `Target: ${variables.unityBuildTarget.value}\n`

      await writeFile(versionFile, versionFileContent)

      core.setOutput('unityBuildFullPath', unityBuildFullPath)
      core.setOutput('unityBuildName', variables.unityBuildName.value)
      core.setOutput('unityBuildVersion', variables.unityBuildVersion.value)
      core.setOutput('unityBuildTarget', variables.unityBuildTarget.value)
      
    } else {
      console.error("If you get a 'Native Crash Reporting' at UnityEditor.Utils.IconUtility:AddIconToWindowsExecutable try running the build again. God knows why it might work the second time.");
      throw new Error(`Build Run with mode failed! Exit Code ${exitCode}`);
    }

  } catch (error) {
    if (error instanceof Error) {
      core.error(error)
    }
    else core.error("An unexpected error occurred")

    core.setFailed("Error during build run")
  }
}
