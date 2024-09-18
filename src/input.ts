import * as core from '@actions/core';
import { validateVariables} from "unity-ci-self-hosted-common/dist";
import { getUnityPath } from "unity-ci-self-hosted-common/dist";
import { VariableValue } from "unity-ci-self-hosted-common/dist";

type Value = VariableValue;

export let variables = {
    // Environment variables
    GITHUB_WORKSPACE: <Value>{ value: process.env.GITHUB_WORKSPACE, mandatory: true },
    UNITY_PATH: <Value>{ 
        value: process.env.UNITY_PATH, 
        mandatory: false, 
        default: getUnityPath('windows', core.getInput('unityVersion'))
    },

    // Github action inputs
    unityVersion:           <Value>{ value: core.getInput('unityVersion'),          mandatory: true                                             },
    unityProjectPath:       <Value>{ value: core.getInput('unityProjectPath'),      mandatory: false,   default: process.env.GITHUB_WORKSPACE   },
    unityBuildName:         <Value>{ value: core.getInput('unityBuildName'),        mandatory: true                                             },
    unityBuildVersion:      <Value>{ value: core.getInput('unityBuildVersion'),     mandatory: true,                                            },      
    unityBuildTarget:       <Value>{ value: core.getInput('unityBuildTarget'),      mandatory: true,                                            },
    unityBuildMethod:       <Value>{ value: core.getInput('unityBuildMethod'),      mandatory: true                                             },
    unityBuildPath:         <Value>{ value: core.getInput('unityBuildPath'),        mandatory: false,   default: 'build'                        },
    unityCustomArguments:   <Value>{ value: core.getInput('unityCustomArguments'),  mandatory: false,   default: 'build'                        },
};

validateVariables(variables);
