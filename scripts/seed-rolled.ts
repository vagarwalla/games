import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SLUG = 'social-deduction-and-classics'
const NAME = 'Social Deduction + Classics'

const INITIAL_GAMES = [
  { bgg_id: '240980', title: 'Blood on the Clocktower', year: 2022, thumbnail: 'https://cf.geekdo-images.com/HbevHxqBGEahONqxmBZEBg__thumb/img/f7CnKwN0D8bGIGlKfmLl0FV48pY=/fit-in/200x150/filters:strip_icc()/pic7840160.png', min_players: 5, max_players: 20 },
  { bgg_id: '129622', title: 'Love Letter', year: 2012, thumbnail: 'https://cf.geekdo-images.com/A1eMExKfVjmFsqmrRHXnmQ__thumb/img/NaK4L0qZMl6ORDiCZdoHvhwWBaQ=/fit-in/200x150/filters:strip_icc()/pic2415178.jpg', min_players: 2, max_players: 4 },
  { bgg_id: '128882', title: 'The Resistance: Avalon', year: 2012, thumbnail: 'https://cf.geekdo-images.com/AvC3AqBG_K5A-bk4RXrQaQ__thumb/img/vu5KFaGdG71N8NuKoEBmEPKY-qI=/fit-in/200x150/filters:strip_icc()/pic1346517.jpg', min_players: 5, max_players: 10 },
  { bgg_id: '131357', title: 'Coup', year: 2012, thumbnail: 'https://cf.geekdo-images.com/MWhSY_GOe2-bmlQ2rntSVg__thumb/img/0OzHVc6k4Dmy71iEMuLM2OYyUjA=/fit-in/200x150/filters:strip_icc()/pic2090079.jpg', min_players: 2, max_players: 6 },
  { bgg_id: '176421', title: 'Deception: Murder in Hong Kong', year: 2014, thumbnail: 'https://cf.geekdo-images.com/n7JmcqTRiHs5RP2GJ2Hs4Q__thumb/img/ZJZ3KQtmQMbSKFfVPbT8Y-OPrLo=/fit-in/200x150/filters:strip_icc()/pic2401747.jpg', min_players: 4, max_players: 12 },
  { bgg_id: '147949', title: 'One Night Ultimate Werewolf', year: 2014, thumbnail: 'https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__thumb/img/3B1CVKF3P-FgVBtbDnkTcBEJqLU=/fit-in/200x150/filters:strip_icc()/pic2415189.jpg', min_players: 3, max_players: 10 },
  { bgg_id: '134352', title: 'Two Rooms and a Boom', year: 2013, thumbnail: 'https://cf.geekdo-images.com/m3BjkNSbDaKZ9LhNeGDx2g__thumb/img/dJXhG5FiQ5HdHcO0yD5-gkRGVYQ=/fit-in/200x150/filters:strip_icc()/pic1887616.jpg', min_players: 6, max_players: 30 },
  { bgg_id: '188406', title: 'Spyfall 2', year: 2016, thumbnail: 'https://cf.geekdo-images.com/BOvNpIMFVeTiMWFYDNbMtg__thumb/img/IW0dxKoXLLRQn8-YF-ERSJTWsiE=/fit-in/200x150/filters:strip_icc()/pic3084922.jpg', min_players: 3, max_players: 12 },
  { bgg_id: '178900', title: 'Codenames', year: 2015, thumbnail: 'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__thumb/img/vM6YA-BxKgJfLflrTGSbPaAKfDs=/fit-in/200x150/filters:strip_icc()/pic2582929.jpg', min_players: 2, max_players: 8 },
  { bgg_id: '157969', title: 'Sheriff of Nottingham', year: 2014, thumbnail: 'https://cf.geekdo-images.com/GjyFxNFDfMT3MtNThCE5bQ__thumb/img/pRpTt6bMJMiKUGwfobOqR3q_jrM=/fit-in/200x150/filters:strip_icc()/pic2075830.jpg', min_players: 3, max_players: 5 },
  { bgg_id: '92415', title: 'Skull', year: 2011, thumbnail: 'https://cf.geekdo-images.com/OHcHWuMF-JNtAOsK_RUEAQ__thumb/img/j0O7vb7MpuV78tUbGTNDN3kNKZE=/fit-in/200x150/filters:strip_icc()/pic1251581.jpg', min_players: 2, max_players: 6 },
  { bgg_id: '217992', title: 'Captain Sonar', year: 2016, thumbnail: 'https://cf.geekdo-images.com/REVKQ8eGLUyS7MhyKQqDQw__thumb/img/PAH1mMjDSFIKVKaWGXVsLmiqnqA=/fit-in/200x150/filters:strip_icc()/pic3349148.jpg', min_players: 2, max_players: 8 },
  { bgg_id: '171273', title: 'FUSE', year: 2015, thumbnail: 'https://cf.geekdo-images.com/xC-KTMPmDVajnpEinUHbQQ__thumb/img/5JDm0fKjpUlg3iBiUg5bXNHkZW0=/fit-in/200x150/filters:strip_icc()/pic2438400.jpg', min_players: 1, max_players: 5 },
]

async function seed() {
  console.log('Seeding initial stack...')

  // Check if stack already exists
  const { data: existing } = await supabase
    .from('game_stacks')
    .select('id')
    .eq('slug', SLUG)
    .single()

  if (existing) {
    console.log(`Stack "${SLUG}" already exists (id: ${existing.id}), skipping.`)
    return
  }

  // Create stack
  const { data: stack, error: stackError } = await supabase
    .from('game_stacks')
    .insert({ slug: SLUG, name: NAME })
    .select()
    .single()

  if (stackError || !stack) {
    console.error('Failed to create stack:', stackError)
    process.exit(1)
  }

  console.log(`Created stack: ${stack.name} (${stack.id})`)

  // Insert games
  const items = INITIAL_GAMES.map((game, i) => ({
    stack_id: stack.id,
    bgg_id: game.bgg_id,
    title: game.title,
    year: game.year,
    thumbnail: game.thumbnail,
    min_players: game.min_players,
    max_players: game.max_players,
    sort_order: i,
  }))

  const { error: itemsError } = await supabase.from('game_stack_items').insert(items)
  if (itemsError) {
    console.error('Failed to insert games:', itemsError)
    process.exit(1)
  }

  console.log(`Inserted ${items.length} games.`)
  console.log('Seed complete!')
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
