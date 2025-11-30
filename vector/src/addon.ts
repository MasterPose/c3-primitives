const Config: PluginConfig = {
  addonType: "plugin",
  type: "world",
  id: "MasterPose_Vector",
  name: "Vector",
  version: "1.0.2.0",
  category: "general",
  author: "Master Pose",
  description:
    "A 2-element structure that represents 2D coordinates or any other pair of numeric values.",
  icon: "icon.svg",
  editorScripts: ["editor.js"],
  interface: {
    instanceName: 'IVectorInstance'
  },
  website: "https://masterpose.itch.io/primitives-c3",
  documentation: "https://masterpose.itch.io/primitives-c3",
  addonUrl: 'https://masterpose.itch.io/primitives-c3',
  githubUrl: "https://github.com/MasterPose/c3-primitives/tree/master/vector",
  info: {
    Set: {
      CanBeBundled: true,
      IsDeprecated: false,
      IsRotatable: true,
      SupportsColor: true,
    },
    AddCommonACEs: {
      Position: true,
      Angle: true,
      SceneGraph: true,
    },
  },
  fileDependencies: {},
  properties: [
    {
      id: "radius",
      name: "Radius",
      desc: "The radius of the point on the editor",
      type: "integer",
      options: {
        interpolatable: false,
        initialValue: 16,
        minValue: 2,
      },
    },
    {
      id: "label",
      name: "Label",
      desc: "Optional label to show below your vector",
      type: "text",
      options: {
        initialValue: "",
        interpolatable: false,
      },
    },
  ],
  aceCategories: {
    general: "General",
    conversion: "Conversion",
    calculation: "Calculation",
    angle: "Angle",
    "size-position": "Size & Position",
  },
};

export default Config as BuiltAddonConfig;
