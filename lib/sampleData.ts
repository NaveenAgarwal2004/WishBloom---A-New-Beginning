export const sampleWishBloom = {
  id: 'sample-001',
  recipientName: 'Emma',
  age: 25,
  creativeAgeDescription: 'Twenty-Five Rotations Around the Sun',
  introMessage: `Dear Emma,

On this day, we've gathered our favorite memories of you—moments we've pressed between the pages of our hearts like flowers in a beloved book. Each memory here is a petal in the garden of who you are: vibrant, kind, and unforgettable.

As you turn 25, we want you to know how deeply you've touched our lives. These aren't just memories; they're love letters written in laughter, tears, and the quiet beauty of everyday moments.

May this collection remind you of how cherished you are, today and always.`,
  uniqueUrl: 'sample-emma-25',
  createdBy: {
    id: 'user-001',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    contributionCount: 3,
  },
  contributors: [
    { id: 'user-001', name: 'Sarah Mitchell', contributionCount: 3 },
    { id: 'user-002', name: 'Michael Chen', contributionCount: 2 },
    { id: 'user-003', name: 'Lisa Thompson', contributionCount: 2 },
    { id: 'user-004', name: 'David Rodriguez', contributionCount: 1 },
    { id: 'user-005', name: 'Jennifer Park', contributionCount: 1 },
  ],
  memories: [
    {
      id: 'mem-001',
      title: 'The Coffee Shop Revelation',
      description: "I remember the day we met like it was pressed in amber. You were reading a book on philosophy while your latte went cold, completely lost in thought. When I asked what you were reading, you looked up with those bright eyes and started explaining Kant's categorical imperative with such passion that I forgot my own order. That's when I knew—this person sees the world differently, and I want to see it through her eyes.",
      date: '2021-08-12',
      contributor: { id: 'user-001', name: 'Sarah Mitchell', contributionCount: 3 },
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
      type: 'featured' as const,
      tags: ['nostalgic', 'milestone'],
      rotation: -2.5,
      createdAt: new Date('2024-05-10T14:30:00Z'), // ✅ Date object
    },
    {
      id: 'mem-002',
      title: 'Late Night Study Sessions',
      description: "Remember when we promised we'd only study for two hours, and somehow it turned into an all-nighter fueled by terrible coffee and even worse jokes? Your determination to understand every concept, to not just memorize but truly grasp the meaning—that's what made those exhausting nights bearable. You made learning feel like an adventure.",
      date: '2022-03-15',
      contributor: { id: 'user-002', name: 'Michael Chen', contributionCount: 2 },
      type: 'standard' as const,
      tags: ['funny', 'nostalgic'],
      rotation: 3.2,
      createdAt: new Date('2024-05-10T14:35:00Z'), // ✅ Date object
    },
    {
      id: 'mem-003',
      title: 'The kindest soul',
      description: "You don't just exist in the world—you actively make it better, one small kindness at a time.",
      date: '2023-07-20',
      contributor: { id: 'user-003', name: 'Lisa Thompson', contributionCount: 2 },
      type: 'quote' as const,
      tags: ['love'],
      rotation: -4.8,
      createdAt: new Date('2024-05-10T14:40:00Z'), // ✅ Date object
    },
    {
      id: 'mem-004',
      title: 'The Rainy Day Rescue',
      description: "That afternoon when I was stranded at the bus stop in a downpour, and you drove 30 minutes out of your way to pick me up—bringing not just an umbrella but also hot chocolate and your warmth. You didn't make a big deal of it, just said 'that's what friends do.' But I'll never forget it. Your kindness isn't loud or showy; it's the quiet, steady kind that changes lives.",
      date: '2022-11-08',
      contributor: { id: 'user-004', name: 'David Rodriguez', contributionCount: 1 },
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80',
      type: 'standard' as const,
      tags: ['love', 'nostalgic'],
      rotation: 5.1,
      createdAt: new Date('2024-05-10T14:45:00Z'), // ✅ Date object
    },
    {
      id: 'mem-005',
      title: 'Graduation Day',
      description: "Watching you walk across that stage, I thought about all the late nights, the doubts you overcame, the mountains you climbed. When they called your name and you threw your cap in the air with that huge smile—that moment was pure magic. You did it, Emma. You actually did it. And we were all so incredibly proud.",
      date: '2023-06-15',
      contributor: { id: 'user-001', name: 'Sarah Mitchell', contributionCount: 3 },
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80',
      type: 'featured' as const,
      tags: ['milestone', 'celebration'],
      rotation: -3.7,
      createdAt: new Date('2024-05-10T14:50:00Z'), // ✅ Date object
    },
    {
      id: 'mem-006',
      title: 'Your laugh',
      description: "It's the sound of sunlight breaking through clouds.",
      date: '2024-01-10',
      contributor: { id: 'user-005', name: 'Jennifer Park', contributionCount: 1 },
      type: 'quote' as const,
      tags: ['love'],
      rotation: 6.3,
      createdAt: new Date('2024-05-10T14:55:00Z'), // ✅ Date object
    },
    {
      id: 'mem-007',
      title: 'The Road Trip Adventure',
      description: "When the GPS failed and we got hopelessly lost in the countryside, you didn't panic. Instead, you turned it into an adventure. We found that hidden waterfall, that tiny café with the best pie, that sunset viewpoint we never would have discovered. You taught me that sometimes the best moments are the unplanned ones. Your sense of wonder makes everything an adventure.",
      date: '2023-09-22',
      contributor: { id: 'user-002', name: 'Michael Chen', contributionCount: 2 },
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
      type: 'standard' as const,
      tags: ['celebration', 'funny'],
      rotation: -5.9,
      createdAt: new Date('2024-05-10T15:00:00Z'), // ✅ Date object
    },
    {
      id: 'mem-008',
      title: 'The Art Gallery Afternoon',
      description: "Standing in front of that impressionist painting, you explained how the artist used light and color to capture not just a moment, but a feeling. I watched you more than the art that day—the way your face lit up, how you gestured with your hands, the passion in your voice. You don't just see beauty, Emma. You understand it, and you share that understanding so generously.",
      date: '2022-05-03',
      contributor: { id: 'user-003', name: 'Lisa Thompson', contributionCount: 2 },
      imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=1200&q=80',
      type: 'standard' as const,
      tags: ['nostalgic'],
      rotation: 4.4,
      createdAt: new Date('2024-05-10T15:05:00Z'), // ✅ Date object
    },
  ],
  messages: [
    {
      id: 'msg-001',
      type: 'letter' as const,
      greeting: 'Dear Emma,',
      content: "I've been trying to write this for days, staring at a blank page and wondering how to capture 25 years of you in words. The truth is, no letter could ever be long enough or eloquent enough to express what you mean to me.\n\nYou've been my anchor in storms, my compass when I was lost, and my cheerleader when I doubted myself. You've celebrated my wins like they were your own and held me through my losses with a grace that still takes my breath away.\n\nAs you step into this new year, I want you to know: you are exactly who you're meant to be. Not perfect—perfectly, beautifully human. And that's more than enough. That's everything.",
      closing: 'With endless gratitude,',
      signature: 'Sarah',
      postscript: "P.S. — I finally finished that book you recommended. You were right. You always are.",
      contributor: { id: 'user-001', name: 'Sarah Mitchell', contributionCount: 3 },
      date: '2024-05-14',
      createdAt: new Date('2024-05-10T14:30:00Z'), // ✅ Date object
    },
    {
      id: 'msg-002',
      type: 'poem' as const,
      title: 'For Emma on Her 25th',
      content: "Twenty-five candles glow tonight,\nEach flame a year of your bright light.\nA quarter century of grace,\nOf kindness written on your face.\n\nYou've grown like gardens after rain,\nTurning small joys from simple pain.\nYour laughter echoes, pure and free—\nA song the world was meant to see.\n\nSo blow your candles, make your wish,\nFor moments sweet as a lover's kiss.\nMay all your dreams take root and bloom,\nAnd chase away life's every gloom.\n\nHere's to you, dear friend so true,\nThe world is brighter because of you.",
      signature: 'Michael',
      contributor: { id: 'user-002', name: 'Michael Chen', contributionCount: 2 },
      date: '2024-05-14',
      createdAt: new Date('2024-05-10T14:35:00Z'), // ✅ Date object
    },
    {
      id: 'msg-003',
      type: 'letter' as const,
      greeting: 'Dearest Emma,',
      content: "Happy birthday to someone who makes the world softer, kinder, and infinitely more beautiful.\n\nI think of all the times you've listened—really listened—when I needed to talk. Not with advice or judgment, but with presence. That's your gift: you make people feel seen.\n\nThis year, I hope you feel as celebrated, as cherished, and as deeply loved as you make everyone around you feel. Because you deserve that and so much more.",
      closing: 'All my love,',
      signature: 'Lisa',
      contributor: { id: 'user-003', name: 'Lisa Thompson', contributionCount: 2 },
      date: '2024-05-14',
      createdAt: new Date('2024-05-10T14:40:00Z'), // ✅ Date object
    },
    {
      id: 'msg-004',
      type: 'letter' as const,
      greeting: 'Happy Birthday, Emma!',
      content: "I know we haven't known each other as long as some of your other friends, but in the time we've spent together, you've shown me what true friendship looks like.\n\nYou're the person who remembers small details, who shows up even when it's inconvenient, who makes everyone feel like they matter. That's rare. That's precious.\n\nHere's to 25 years of you being you, and to many more years of your light shining on all of us lucky enough to know you.",
      closing: 'Cheers,',
      signature: 'David',
      contributor: { id: 'user-004', name: 'David Rodriguez', contributionCount: 1 },
      date: '2024-05-14',
      createdAt: new Date('2024-05-10T14:45:00Z'), // ✅ Date object
    },
  ],
  celebrationWishPhrases: [
    'Endless joy! ✨',
    'So proud of you',
    'Best year yet! 🎉',
    'You are amazing 💛',
    'Keep shining bright',
    'Here is to you!',
    'Another beautiful chapter',
    'You deserve the world',
    'Grateful for you',
    'The best is yet to come',
    'Cheers to 25! 🥂',
    'Forever your friend',
  ],
  createdDate: '2024-05-14T10:00:00Z',
  viewCount: 0,
}
