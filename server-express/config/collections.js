module.exports = {
  defect: { 
    tables: {
      main: {name: "defects"}, 
      journal: {name: "defectj"},
      viewAllFirstJ: {name: "defects_all_firstj"},
      viewAllLastJ: {name: "defects_all_lastj"},
    },
    itemNames: {
      item: "defektas", 
      Item: "Defektas"
    },
    notPanaikinta: "(dstop = '')",
    samePlace: {
      query: "(linija = @linija AND kelias = @kelias AND km = @km AND pk = @pk AND m = @m AND siule = @siule)",
      filter: {
        insert: " WHERE regbit = ?",
        update: " WHERE id <> @id AND regbit = ?",
      }
    },
    permissions: {
      update: ["adm", "superadm", "dev"],
      insert: ["adm", "superadm", "dev"],
      delete: ["adm", "superadm", "dev"]
    }
  },

  welding: { 
    tables: {
      main: {name: "weldings"}, 
      journal: {name: "weldingj"}
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