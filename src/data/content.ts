// SAMPLE CONTENT: replace with real customer reviews before launch.
export const testimonials = [
  [
    "Amelia R.",
    "Berlin",
    "Germany",
    5,
    "The finish is extraordinary. It feels like a future heirloom, and the packaging was impeccable.",
  ],
  [
    "Claire T.",
    "Singapore",
    "Singapore",
    5,
    "Quiet luxury at its best. The team answered every question and delivery was beautifully handled.",
  ],
  [
    "Marcus W.",
    "New York",
    "USA",
    5,
    "My wedding band is substantial, comfortable, and exactly as refined as I hoped.",
  ],
  [
    "Sofia L.",
    "Munich",
    "Germany",
    5,
    "The diamond catches light without ever feeling overstated. I wear it every day.",
  ],
  [
    "Daniel K.",
    "Zurich",
    "Switzerland",
    5,
    "A seamless gold purchase with clear documentation and attentive communication.",
  ],
  [
    "Isabelle M.",
    "Paris",
    "France",
    5,
    "From the first consultation to the unboxing, every detail felt personal.",
  ],
  [
    "Nora J.",
    "Copenhagen",
    "Denmark",
    5,
    "My necklace is beautifully balanced and even more luminous in person.",
  ],
  [
    "Ethan S.",
    "Boston",
    "USA",
    5,
    "Excellent craft, insured shipping, and a refreshingly straightforward experience.",
  ],
] as const;

const reviewText = [
  [
    "Elena M.",
    "Beautifully made",
    "The proportions are perfect and the polish has a depth that photographs cannot capture.",
  ],
  [
    "James C.",
    "Exceptional quality",
    "Arrived securely and presented with care. The craftsmanship is immediately apparent.",
  ],
  [
    "Nadia P.",
    "A modern heirloom",
    "Elegant enough for special occasions but considered enough to wear every day.",
  ],
  [
    "Thomas A.",
    "Worth the wait",
    "The weight, finish, and small details exceeded my expectations.",
  ],
  [
    "Maya L.",
    "Simply luminous",
    "A refined piece that catches the light beautifully without ever feeling excessive.",
  ],
] as const;

export const reviewsByProduct = Object.fromEntries(
  Array.from({ length: 50 }, (_, i) => [
    `LW-${String(i + 1).padStart(3, "0")}`,
    reviewText.slice(0, 3 + (i % 3)).map((r, j) => ({
      id: `${i}-${j}`,
      name: r[0],
      title: r[1],
      body: r[2],
      rating: j === 4 ? 4 : 5,
      date: `2025-${String(((i + j) % 9) + 1).padStart(2, "0")}-12`,
      verified: false,
    })),
  ]),
);
