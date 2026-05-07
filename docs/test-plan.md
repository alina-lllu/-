# Test Plan: Otome VN — MVP

## Critical (block launch)
- [ ] Scene JSON loads successfully from `public/script`
- [ ] Choice selection advances to the configured `next` line
- [ ] Affection deltas apply once per selected option
- [ ] Chapter-end affection branch resolves to the expected ending
- [ ] localStorage save/load round-trip preserves scene, line, affection, and flags

## High (complete before first player)
- [ ] Fixed dialogue branch text displays without free-text input
- [ ] Character emotion sprite updates on dialogue lines
- [ ] Scene transition between `ch1_scene01`, `ch1_scene02`, and `ch1_scene03`
- [ ] Character memory: choice in scene 1 → referenced correctly in scene 3

## Medium (complete before launch)
- [ ] Mobile viewport: choice panel and dialogue box remain usable
- [ ] Browser refresh resumes from persisted progress
- [ ] Manual review: fixed dialogue stays in character voice

## Out of scope (v2)
- Cloud save sync
- Mobile app testing
