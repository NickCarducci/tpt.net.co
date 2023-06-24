import PouchDB from "pouchdb";

export default class SDB {
  constructor(name) {
    this.db = new PouchDB("scopekey", { revs_limit: 1, auto_compaction: true });
  }
  async readKey() {
    let allNotes = await this.db.allDocs({ include_docs: true });
    let notes = {};

    allNotes.rows.forEach(n => (notes[n.doc.key] = n.doc));

    return notes;
  }

  async setKey(key) {
    const res = await this.db.post({ key });

    return res;
  }

  deleteKeys() {
    this.db.destroy();
  }
}
