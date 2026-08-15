import { z } from "zod";

export const rhymeSubmissionSchema = z
  .object({
    category: z.enum(["Rhyme / Song", "Riddle", "Proverb / Adage"]).default("Rhyme / Song"),
    name: z.string().optional(),
    language: z.enum([
      "English",
      "Yoruba",
      "Hausa",
      "Igbo",
      "Pidgin",
      "Efik / Ibibio",
      "Edo",
      "Other",
    ]),
    type: z.enum([
      "Assembly / march-in chant",
      "Nursery rhyme",
      "Playground song",
      "Folk tale / Lullaby",
      "Game / Counting chant",
      "Word riddle / Puzzle",
      "Picture / Gesture riddle",
      "Tricky question",
      "Moral / Wisdom proverb",
      "Warning / Caution adage",
      "Philosophical saying",
      "Humorous / Satirical proverb",
      "Other",
    ]),
    text: z.string().optional(),
    riddleAnswer: z.string().optional(),
    proverbMeaning: z.string().optional(),
    learnedWhere: z.enum([
      "School assembly",
      "Playground",
      "Home / Grandparents",
      "Church or Sunday school",
      "Moonlight tales",
      "Other",
    ]),
    locationGrewUp: z.string().optional(),
    schoolType: z
      .enum([
        "Public / Government Primary",
        "Private / International",
        "Mission / Convent / Islamic",
        "Boarding School",
        "Community / Village School",
        "Other",
      ])
      .optional(),
    era: z.enum(["Before 1990", "1990s", "2000s", "2010s+"]),
    region: z.string().optional(),
    hasMorals: z.enum(["Yes", "No"], {
      message: "Please specify if this entry carries a moral or life lesson.",
    }),
    moralsStrength: z.coerce.number().min(1).max(5).default(3),
    moralDescription: z.string().optional(),
    goingExtinct: z.enum(["Yes", "No"], {
      message: "Please specify if you feel this entry is going extinct.",
    }),
    extinctStrength: z.coerce.number().min(1).max(5).default(3),
    extinctReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === "Riddle" && !data.riddleAnswer?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Don't spoil it — please provide the answer to the riddle!",
        path: ["riddleAnswer"],
      });
    }
  });

export type RhymeSubmissionFormData = z.infer<typeof rhymeSubmissionSchema>;
