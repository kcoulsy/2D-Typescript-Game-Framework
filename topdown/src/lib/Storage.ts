import superjson from "superjson";

export class Storage<DataShape extends Record<string, unknown>> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  save = (data: DataShape) => {
    try {
      const json = superjson.stringify({ saveData: data });
      localStorage.setItem(this.storageKey, json);
      console.log("Saved data to storage");
    } catch (error) {
      console.error("error saving data", error);
    }
  };

  load = (): DataShape | null => {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (!json) {
        return null;
      }
      const { saveData } = superjson.parse<{ saveData: DataShape }>(json);
      console.log("Loaded data from storage");
      return saveData;
    } catch (error) {
      console.error("error loading data", error);
      return null;
    }
  };
}
