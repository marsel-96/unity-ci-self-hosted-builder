import * as core from '@actions/core'
import { runCommand } from "unity-ci-self-hosted-common/dist";
import { logLines } from "unity-ci-self-hosted-common/dist";
import { join, isAbsolute } from 'path'
import { variables } from './input'


/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    
    let unityBuildFullpath = isAbsolute(variables.unityBuildPath.value) ? 
      variables.unityBuildPath.value : 
      join(variables.GITHUB_WORKSPACE.value, variables.unityBuildPath.value)

    let command = variables.UNITY_PATH.value
    let args = [
      "-quit",
      "-batchmode",
      "-nographics",
      "-silent-crashes",
      "-executeMethod " + variables.unityBuildMethod.value,
      "-customBuildName " + variables.unityBuildName.value,
      "-buildTarget " + variables.unityBuildTarget.value,
      "-customBuildTarget " + variables.unityBuildTarget.value,
      "-buildVersion " + variables.unityBuildVersion.value,
      "-projectPath " + variables.unityProjectPath.value,
      "-customBuildPath " + unityBuildFullpath,
      "-logfile -"
    ]

    if (variables.unityCustomArguments.value) {
      args.push(variables.unityCustomArguments.value)
    }
    
    let exitCode = await runCommand(command, args)
      .catch((error) => {
        throw new Error(`\n\nException while running unity command. ${error}`);
      })

    if (exitCode === 0) {
      logLines(
        '',
        '',
        'Build Succeeded!!',
        '',
        '###########################',
        '#       Build output      #',
        '###########################',
      )

      await runCommand('powershell', ['Get-ChildItem', unityBuildFullpath])

    } else {
      console.error("If you get a 'Native Crash Reporting' at UnityEditor.Utils.IconUtility:AddIconToWindowsExecutable try running the build again. God knows why it might work the second time.");
      throw new Error(`Build Run with mode failed! Exit Code ${exitCode}`);
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error("\n" + error.message)
      core.setFailed("Error during build run")
    }
    else core.setFailed("An unexpected error occurred")
  }
}
