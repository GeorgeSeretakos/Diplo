const commands = [`
  CREATE UNIQUE INDEX idx_unique_debate ON debates (document_id);
  CREATE UNIQUE INDEX idx_unique_speaker ON speakers (document_id);
  CREATE UNIQUE INDEX idx_unique_political_party ON political_parties (document_id);
  CREATE UNIQUE INDEX idx_unique_speech ON speeches (document_id);

  DROP INDEX IF EXISTS idx_unique_debate;
  DROP INDEX IF EXISTS idx_unique_speaker;
  DROP INDEX IF EXISTS idx_unique_political_party;
  DROP INDEX IF EXISTS idx_unique_speech;

`];