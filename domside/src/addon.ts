const Config: PluginConfig = {
  addonType: "plugin",
  type: "object",
  id: "MasterPose_DomSide",
  name: "Dom Side",
  version: "1.0.0.0",
  category: "other",
  author: "Master Pose",
  description: "Allows you to load scripts to the DOM Side from the Worker & to communicate between the two using IPC calls.",
  icon: "icon.svg",
  domSideScripts: ['domSide.js'],
  editorScripts: ['editor.js'],
  interface: {
    instanceName: 'IDomSide'
  },
  website: "https://masterpose.itch.io/primitives-c3",
  documentation: "https://masterpose.itch.io/primitives-c3",
  addonUrl: 'https://masterpose.itch.io/primitives-c3',
  githubUrl: "https://github.com/MasterPose/c3-primitives/tree/master/domside",
  info: {
    Set: {
      CanBeBundled: true,
      IsDeprecated: false,
      IsSingleGlobal: true,
    },
  },
  fileDependencies: {},
  properties: [],
  aceCategories: {
    general: "General",

    callDomSide: "Call DOM Side",
    callDomSideResponse: "Call DOM Side Response",

    handleDomSide: "Handle DOM Side Call"
  },
};

export default Config as BuiltAddonConfig;
