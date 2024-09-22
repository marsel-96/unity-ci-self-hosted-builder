import * as core from '@actions/core';
import { getUnityPathOrDefault, getUnityPathFromProject } from 'unity-ci-self-hosted-common/dist';
import { validateVariables} from "unity-ci-self-hosted-common/dist";
import { VariableValue } from "unity-ci-self-hosted-common/dist";

type Value = VariableValue;

export let variables = {
    // Environment variables
    GITHUB_WORKSPACE: <Value>{ value: process.env.GITHUB_WORKSPACE, mandatory: true },
    UNITY_PATH: <Value>{ 
        value: process.env.UNITY_PATH, 
        mandatory: false
    },

    // Github action inputs
    unityVersion:           <Value>{ value: core.getInput('unityVersion'),          mandatory: true                      },
    unityBuildName:         <Value>{ value: core.getInput('unityBuildName'),        mandatory: true                      },
    unityBuildVersion:      <Value>{ value: core.getInput('unityBuildVersion'),     mandatory: true,                     },      
    unityBuildTarget:       <Value>{ value: core.getInput('unityBuildTarget'),      mandatory: true,                     },
    unityBuildMethod:       <Value>{ value: core.getInput('unityBuildMethod'),      mandatory: true                      },

    unityProjectPath:       <Value>{ value: core.getInput('unityProjectPath'),      mandatory: false,   default: ''      },  
    unityBuildPath:         <Value>{ value: core.getInput('unityBuildPath'),        mandatory: false,   default: ''      },
    unityCustomArguments:   <Value>{ value: core.getInput('unityCustomArguments'),  mandatory: false,   default: 'build' },
};

validateVariables(variables);

variables.unityProjectPath.value = getUnityPathOrDefault(variables.unityProjectPath.value, variables.GITHUB_WORKSPACE.value);
variables.unityBuildPath.value = getUnityPathOrDefault(variables.unityBuildPath.value, variables.unityProjectPath.value);

variables.UNITY_PATH.value = variables.UNITY_PATH.value ?? getUnityPathFromProject("windows", variables.unityProjectPath.value);

