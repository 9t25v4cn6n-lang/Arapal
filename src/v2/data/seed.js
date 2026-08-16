// Sample content, created on request only.
//
// Deliberately NOT auto-seeded. A first-run user should meet a genuine empty
// state — the audit recorded "no true empty state" as a missing capability
// across four screens, and R3 designed the answer (Home / 02 · Empty · No
// source). Auto-seeding would hide that state permanently and make the product
// look populated when it is not.
//
// Instead the empty state offers this explicitly, and everything it creates is
// marked so it can be told apart from the user's own work.

import * as store from './store.js'

export const SAMPLE_PROJECT_TITLE = 'Al-Hidayah — The Book of Prayer (sample)'

const SAMPLE_SEGMENTS = [
  {
    ref: '1.1',
    title: 'Pure water as original purifier',
    chapterLabel: 'Chapter 1: Purity',
    text: 'الماء المطلق طهور لا يخرج عن الطهورية إلا بتغير أحد أوصافه بنجاسة ظاهرة.',
  },
  {
    ref: '1.2',
    title: 'Purifying water categories',
    chapterLabel: 'Chapter 1: Purity',
    text: 'والماء الذي يجوز به الوضوء كل ماء نزل من السماء أو نبع من الأرض ما دام باقيا على أصل خلقته.',
  },
  {
    ref: '1.3',
    title: 'Comprehensive city condition',
    chapterLabel: 'Chapter 1: Purity',
    text: 'لا تصح الجمعة إلا في مصر جامع أو في مصلى المصر ولا تجوز في القرى.',
  },
  {
    ref: '1.4',
    title: 'Earth substitute when water is unavailable',
    chapterLabel: 'Chapter 1: Purity',
    text: 'والتيمم جائز عند عدم الماء أو العجز عن استعماله بالصعيد الطاهر على الوجه المأمور به.',
  },
]

/**
 * Create the sample project and return it. Idempotent by title so repeated
 * clicks do not accumulate duplicates.
 */
export function seedSampleProject() {
  const existing = store.listProjects().find((p) => p.title === SAMPLE_PROJECT_TITLE)
  if (existing) {
    store.selectProject(existing.id)
    return existing
  }

  const project = store.addProject({
    title: SAMPLE_PROJECT_TITLE,
    subtitle: 'Foundational treatise',
    reference: 'sample',
  })
  const source = store.addSource({
    projectId: project.id,
    label: 'Sample source',
    rawText: SAMPLE_SEGMENTS.map((s) => s.text).join(' '),
  })
  store.publishSegments({ projectId: project.id, sourceId: source.id, chunks: SAMPLE_SEGMENTS })
  return store.getProject(project.id)
}
