const Config: PluginConfig = {
  addonType: "plugin",
  type: "world",
  id: "MasterPose_Collider",
  name: "Collider",
  version: "1.0.2.0",
  category: "general",
  author: "Master Pose",
  description: "A rectangle shape used for physics collision.",
  icon: "icon.svg",
  editorScripts: ['editor.js'],
  website: "https://masterpose.itch.io/primitives-c3",
  documentation: "https://masterpose.itch.io/primitives-c3",
  addonUrl: 'https://masterpose.itch.io/primitives-c3',
  githubUrl: "https://github.com/MasterPose/c3-primitives/tree/master/collider",
  info: {
    Set: {
      CanBeBundled: true,
      IsDeprecated: false,
      IsResizable: true,
      IsRotatable: true,
      SupportsZElevation: true,
      SupportsColor: true,
    },
    AddCommonACEs: {
      Position: true,
      Size: true,
      Angle: true,
      ZOrder: true,
      SceneGraph: true
    }
  },
  fileDependencies: {},
  properties: [],
  aceCategories: {
    general: "General",
  },
};

export default Config as BuiltAddonConfig;
