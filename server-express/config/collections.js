exports = {
  defect: { 
    tables: {
      main: {name: "defects"}, 
      journal: {name: "defectj"}
    },
    itemNames: {
      item: "defektas", 
      Item: "Defektas"
    },
    notPanaikinta: "(defects.daction = '')",
    samePlace: "(linija = @linija AND kelias = @kelias AND km = @km AND pk = @pk AND m = @m AND siule = @siule)",
    permissions: {
      update: ["adm", "superadm", "dev"],
      insert: ["adm", "superadm", "dev"],
      delete: ["adm", "superadm", "dev"]
    }
  },

  welding: { 
    tables: {
      main: {name: "weldings", autoId: true}, 
      journal: {name: "weldingj", autoId: false}
    },
    itemNames: {
      item: "suvirinimas", 
      Item: "Suvirinimas"
    },
    notPanaikinta: "(status > 0)",
    samePlace: "(linija = @linija AND kelias = @kelias AND km = @km AND pk = @pk AND m = @m AND siule = @siule)",
    permissions: {
      update: ["adm", "superadm", "dev"],
      insert: ["adm", "superadm", "dev"],
      delete: ["adm", "superadm", "dev"]
    }
  }
};