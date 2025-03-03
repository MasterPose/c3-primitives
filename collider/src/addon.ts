import { BuiltAddonConfig, PluginConfig } from "c3-framework";

const Config: PluginConfig = {
  addonType: "plugin",
  type: "world",
  id: "MasterPose_Collider",
  name: "Collider",
  version: "1.0.0.0",
  category: "general",
  author: "Master Pose",
  description: "A rectangle shape used for physics collision.",
  icon: "icon.svg",
  editorScripts: ['editor.js'],
  website: "https://www.construct.net",
  documentation: "https://www.construct.net",
  addonUrl: 'https://www.construct.net/addons/',
  githubUrl: "https://github.com/Master Pose/Collider",
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
  properties: [
    // {
    //   id: 'radius',
    //   name: 'Radius',
    //   desc: 'The "roundness" of the collider',
    //   type: 'percent',
    //   options: {
    //     interpolatable: false,
    //     initialValue: 0,
    //     minValue: 0,
    //     maxValue: 100,
    //   }
    // }
  ],
  aceCategories: {
    general: "General",
  },
};

export default Config as BuiltAddonConfig;