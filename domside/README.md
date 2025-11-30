<img src="./src/icon.svg" width="100" /><br>

# Dom Side

Allows you to load scripts to the DOM Side from the Worker & to communicate between the two using IPC calls.

Author: Master Pose <br>
Website: [https://masterpose.itch.io/primitives-c3](https://masterpose.itch.io/primitives-c3) <br>
Addon Url: [https://masterpose.itch.io/primitives-c3](https://masterpose.itch.io/primitives-c3) <br>
Download Latest Version : [Version: 1.0.0.0](https://github.com/MasterPose/c3-primitives/tree/master/domside/releases/latest) <br>

<br>

<sub>

Made using [c3-framework](https://github.com/C3Framework/framework)

</sub>

## Table of Contents

- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)

---

## Usage

First you must install the dependencies via NPM using:

```
npm install
```

To build the addon, run the following command:

```
npx c3fo build
```

To start the dev server, run:

```
npx c3fo build -D
```

The build uses the `addon.ts` file for the configurations and the `runtime.ts` file as the entry point to generate everything else.
The files defined with `@AceClass` contain all the Actions, Conditions and Expressions logic and configuration, you may want to check them.

## Examples Files

- [demo](./examples/demo.c3p)
<br>

---

## Properties

| Property Name | Description | Type |
| --- | --- | --- |


---

## Actions

| Action | Description | Params |
| --- | --- | --- |
| Import File |  | File *(projectfile)* <br> |
| Send Event |  | Tag *(string)* <br>Data *(any)* <br> |
| Invoke |  | Tag *(string)* <br>Data *(any)* <br> |
| Set Return Value |  | Value *(any)* <br> |

---
## Conditions

| Condition | Description | Params |
| --- | --- | --- |
| On Invoke  Callback |  | Tag *(string)* <br> |
| On Handle |  | Tag *(string)* <br> |
| On Event |  | Tag *(string)* <br> |
| On Any Event |  |  |

---
## Expressions

| Expression | Description | Return Type | Params |
| --- | --- | --- | --- |
| message |  | any |  |
| messageTag |  | string |  |
| fromMessage |  | any | Path *(string)* <br> |
| messageAsJSON |  | any |  |
