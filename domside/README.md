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

- [demo-domside](./examples/demo-domside.c3p)
<br>

---

## Properties

| Property Name | Description | Type |
| --- | --- | --- |


---

## Actions

| Action | Description | Params |
| --- | --- | --- |
| Import script | Loads a .js file in the DOM side. | File *(projectfile)* <br> |
| Send event | Sends an event to the DOM Side. | Tag *(string)* <br>Data *(any)* <br> |
| Invoke | Invokes a procedure call from the DOM Side. | Tag *(string)* <br>Data *(any)* <br> |
| Set return value | Sets the value to return to the DOM Side from a procedure call. Use this inside the "On handle" trigger. | Value *(any)* <br> |

---
## Conditions

| Condition | Description | Params |
| --- | --- | --- |
| On invoke response | Triggers after DOM Side returns a value from an "Invoke" call. | Tag *(string)* <br> |
| On handle | Registers a procedure call that the DOM Side can call. [u]You can only register one event for each tag[/u]. | Tag *(string)* <br> |
| On event | Triggers when the DOM Side sends an event with the given tag / id. | Tag *(string)* <br> |
| On any event | Triggers when the DOM Side sends any event |  |

---
## Expressions

| Expression | Description | Return Type | Params |
| --- | --- | --- | --- |
| messageAsBeautifiedJSON | Gets an human-readable JSON of the last relevant IPC message sent. | string |  |
| message | Contains the last relevant IPC message sent. Use this on all the triggers available. | any |  |
| messageTag | Contains the last relevant IPC message tag/id sent. Use this on all the triggers available. | string |  |
| fromMessage | If you sent an object or array message, use a dot notation path to get a value from it. | any | Path *(string)* <br> |
| messageAsJSON | Stringifies the last relevant IPC message sent. | any |  |
