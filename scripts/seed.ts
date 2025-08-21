import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
    ]);

    const courses = await db
      .insert(schema.courses)
      .values([
        {
          title: "Personal Finance",
          imageSrc:
            "https://images.pexels.com/photos/7876274/pexels-photo-7876274.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      ])
      .returning();

    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1: Budgeting Basics",
            description: `Learn the fundamentals of managing your money.`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2: Saving & Investing",
            description: `Discover how to grow your wealth.`,
            order: 2,
          },
        ])
        .returning();

      for (const unit of units) {
        // Seeding for Unit 1
        if (unit.order === 1) {
          const lessons = await db
            .insert(schema.lessons)
            .values([
              { unitId: unit.id, title: "Introduction to Budgeting", order: 1 },
              { unitId: unit.id, title: "Needs vs. Wants", order: 2 },
            ])
            .returning();

          for (const lesson of lessons) {
            if (lesson.order === 1) {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: 'Which of these is a "budget"?',
                    order: 1,
                  },
                  {
                    lessonId: lesson.id,
                    type: "ASSIST",
                    question: 'A budget is a plan for your ___."',
                    order: 2,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "A plan for your money",
                      imageSrc:
                        "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "A type of stock",
                      imageSrc:
                        "https://images.pexels.com/photos/592753/pexels-photo-592753.jpeg?auto=compress&cs=tinysrgb&w=600",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "A credit score",
                      imageSrc:
                        "https://images.pexels.com/photos/7245342/pexels-photo-7245342.jpeg?auto=compress&cs=tinysrgb&w=600",
                    },
                  ]);
                }

                if (challenge.order === 2) {
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "money",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "time",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "food",
                    },
                  ]);
                }
              }
            }
          }
        }

        // Seeding for Unit 2
        if (unit.order === 2) {
          const lessons = await db
            .insert(schema.lessons)
            .values([
              { unitId: unit.id, title: "Understanding Savings", order: 1 },
              { unitId: unit.id, title: "Compound Interest", order: 2 },
            ])
            .returning();

          for (const lesson of lessons) {
            if (lesson.order === 2) {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "What is compound interest?",
                    order: 1,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "Interest earned on interest",
                      imageSrc:
                        "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=600",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "A bank fee",
                      imageSrc:
                        "https://images.pexels.com/photos/5997298/pexels-photo-5997298.jpeg?auto=compress&cs=tinysrgb&w=600",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "A type of tax",
                      imageSrc:
                        "https://images.pexels.com/photos/6863261/pexels-photo-6863261.jpeg?auto=compress&cs=tinysrgb&w=600",
                    },
                  ]);
                }
              }
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
