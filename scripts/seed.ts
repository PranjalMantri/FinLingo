import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "../db/schema";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const main = async () => {
  try {
    await client.connect();
    const db = drizzle(client, { schema });

    console.log("Seeding finance database...");

    // Clear existing data
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    const courses = await db
      .insert(schema.courses)
      .values([
        {
          title: "Personal Finance & Money Management",
          imageSrc: "/finance/personal-finance.svg",
        },
        {
          title: "Business & Entrepreneurship",
          imageSrc: "/finance/business.svg",
        },
        {
          title: "Investment & Wealth Building",
          imageSrc: "/finance/investment.svg",
        },
        {
          title: "Economics & Market Analysis",
          imageSrc: "/finance/economics.svg",
        },
      ])
      .returning();

    // ==================== COURSE 1: Personal Finance & Money Management ====================
    const personalFinanceCourse = courses.find(
      (course) => course.title === "Personal Finance & Money Management"
    );
    if (personalFinanceCourse) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: personalFinanceCourse.id,
            title: "Budgeting Fundamentals",
            description: "Master the art of creating and managing budgets",
            order: 1,
          },
          {
            courseId: personalFinanceCourse.id,
            title: "Saving Strategies",
            description: "Learn how to save money effectively and build wealth",
            order: 2,
          },
          {
            courseId: personalFinanceCourse.id,
            title: "Debt Management",
            description: "Understand and eliminate debt systematically",
            order: 3,
          },
          {
            courseId: personalFinanceCourse.id,
            title: "Emergency Funds & Financial Security",
            description:
              "Build financial resilience and prepare for unexpected events",
            order: 4,
          },
        ])
        .returning();

      // Unit 1: Budgeting Fundamentals
      const budgetingLessons = await db
        .insert(schema.lessons)
        .values([
          {
            unitId: units[0].id,
            title: "Understanding Income vs Expenses",
            order: 1,
          },
          { unitId: units[0].id, title: "The 50/30/20 Rule", order: 2 },
          { unitId: units[0].id, title: "Tracking Your Spending", order: 3 },
        ])
        .returning();

      const budgetingChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: budgetingLessons[0].id,
            type: "SELECT",
            question: "What is the first step in creating a budget?",
            order: 1,
          },
          {
            lessonId: budgetingLessons[0].id,
            type: "SELECT",
            question: "Which of these is considered a fixed expense?",
            order: 2,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: budgetingChallenges[0].id,
          text: "Calculate your total income",
          correct: true,
          imageSrc: "/finance/income.svg",
        },
        {
          challengeId: budgetingChallenges[0].id,
          text: "Buy a budgeting app",
          correct: false,
          imageSrc: "/finance/app.svg",
        },
        {
          challengeId: budgetingChallenges[0].id,
          text: "Set financial goals",
          correct: false,
          imageSrc: "/finance/goals.svg",
        },
      ]);

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: budgetingChallenges[1].id,
          text: "Rent payment",
          correct: true,
          imageSrc: "/finance/rent.svg",
        },
        {
          challengeId: budgetingChallenges[1].id,
          text: "Entertainment expenses",
          correct: false,
          imageSrc: "/finance/entertainment.svg",
        },
        {
          challengeId: budgetingChallenges[1].id,
          text: "Grocery shopping",
          correct: false,
          imageSrc: "/finance/groceries.svg",
        },
      ]);

      // Unit 2: Saving Strategies
      const savingLessons = await db
        .insert(schema.lessons)
        .values([
          { unitId: units[1].id, title: "Pay Yourself First", order: 1 },
          {
            unitId: units[1].id,
            title: "High-Yield Savings Accounts",
            order: 2,
          },
          { unitId: units[1].id, title: "Automating Your Savings", order: 3 },
        ])
        .returning();

      const savingChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: savingLessons[0].id,
            type: "SELECT",
            question: "What does 'pay yourself first' mean?",
            order: 1,
          },
          {
            lessonId: savingLessons[1].id,
            type: "ASSIST",
            question: "What is a high-yield savings account?",
            order: 1,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: savingChallenges[0].id,
          text: "Save money before paying any expenses",
          correct: true,
          imageSrc: "/finance/save-first.svg",
        },
        {
          challengeId: savingChallenges[0].id,
          text: "Pay your salary to yourself",
          correct: false,
          imageSrc: "/finance/salary.svg",
        },
        {
          challengeId: savingChallenges[0].id,
          text: "Buy yourself gifts first",
          correct: false,
          imageSrc: "/finance/gift.svg",
        },
      ]);
    }

    // ==================== COURSE 2: Business & Entrepreneurship ====================
    const businessCourse = courses.find(
      (course) => course.title === "Business & Entrepreneurship"
    );
    if (businessCourse) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: businessCourse.id,
            title: "Startup Fundamentals",
            description: "Learn the basics of starting and running a business",
            order: 1,
          },
          {
            courseId: businessCourse.id,
            title: "Fundraising & Venture Capital",
            description: "Master the art of raising capital for your startup",
            order: 2,
          },
          {
            courseId: businessCourse.id,
            title: "Business Models & Revenue Streams",
            description: "Understand different ways to monetize your business",
            order: 3,
          },
          {
            courseId: businessCourse.id,
            title: "Scaling & Growth Strategies",
            description:
              "Learn how to grow and scale your business effectively",
            order: 4,
          },
        ])
        .returning();

      // Unit 1: Startup Fundamentals
      const startupLessons = await db
        .insert(schema.lessons)
        .values([
          {
            unitId: units[0].id,
            title: "Identifying Market Opportunities",
            order: 1,
          },
          { unitId: units[0].id, title: "Building an MVP", order: 2 },
          {
            unitId: units[0].id,
            title: "Legal Structure & Registration",
            order: 3,
          },
        ])
        .returning();

      const startupChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: startupLessons[0].id,
            type: "SELECT",
            question: "What does MVP stand for in startup terminology?",
            order: 1,
          },
          {
            lessonId: startupLessons[1].id,
            type: "SELECT",
            question: "Which is the most important feature of an MVP?",
            order: 1,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: startupChallenges[0].id,
          text: "Minimum Viable Product",
          correct: true,
          imageSrc: "/finance/mvp.svg",
        },
        {
          challengeId: startupChallenges[0].id,
          text: "Maximum Value Proposition",
          correct: false,
          imageSrc: "/finance/value.svg",
        },
        {
          challengeId: startupChallenges[0].id,
          text: "Most Valuable Player",
          correct: false,
          imageSrc: "/finance/player.svg",
        },
      ]);

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: startupChallenges[1].id,
          text: "Solves the core problem",
          correct: true,
          imageSrc: "/finance/problem-solving.svg",
        },
        {
          challengeId: startupChallenges[1].id,
          text: "Has the most features",
          correct: false,
          imageSrc: "/finance/features.svg",
        },
        {
          challengeId: startupChallenges[1].id,
          text: "Looks visually appealing",
          correct: false,
          imageSrc: "/finance/design.svg",
        },
      ]);

      // Unit 2: Fundraising & Venture Capital
      const fundraisingLessons = await db
        .insert(schema.lessons)
        .values([
          { unitId: units[1].id, title: "Types of Funding Rounds", order: 1 },
          {
            unitId: units[1].id,
            title: "Understanding VCs and Angel Investors",
            order: 2,
          },
          { unitId: units[1].id, title: "Creating a Pitch Deck", order: 3 },
        ])
        .returning();

      const fundraisingChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: fundraisingLessons[0].id,
            type: "SELECT",
            question: "What comes first in the funding sequence?",
            order: 1,
          },
          {
            lessonId: fundraisingLessons[1].id,
            type: "SELECT",
            question: "What do VCs typically look for in a startup?",
            order: 1,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: fundraisingChallenges[0].id,
          text: "Pre-seed funding",
          correct: true,
          imageSrc: "/finance/pre-seed.svg",
        },
        {
          challengeId: fundraisingChallenges[0].id,
          text: "Series A funding",
          correct: false,
          imageSrc: "/finance/series-a.svg",
        },
        {
          challengeId: fundraisingChallenges[0].id,
          text: "IPO",
          correct: false,
          imageSrc: "/finance/ipo.svg",
        },
      ]);

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: fundraisingChallenges[1].id,
          text: "Scalable business model",
          correct: true,
          imageSrc: "/finance/scalable.svg",
        },
        {
          challengeId: fundraisingChallenges[1].id,
          text: "Perfect product from day one",
          correct: false,
          imageSrc: "/finance/perfect.svg",
        },
        {
          challengeId: fundraisingChallenges[1].id,
          text: "Immediate profitability",
          correct: false,
          imageSrc: "/finance/profit.svg",
        },
      ]);
    }

    // ==================== COURSE 3: Investment & Wealth Building ====================
    const investmentCourse = courses.find(
      (course) => course.title === "Investment & Wealth Building"
    );
    if (investmentCourse) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: investmentCourse.id,
            title: "Investment Basics",
            description: "Understanding different types of investments",
            order: 1,
          },
          {
            courseId: investmentCourse.id,
            title: "Stock Market Fundamentals",
            description: "Learn how to invest in stocks and analyze companies",
            order: 2,
          },
          {
            courseId: investmentCourse.id,
            title: "Portfolio Diversification",
            description: "Build a balanced investment portfolio",
            order: 3,
          },
          {
            courseId: investmentCourse.id,
            title: "Retirement Planning",
            description: "Plan for long-term wealth building and retirement",
            order: 4,
          },
        ])
        .returning();

      // Unit 1: Investment Basics
      const investmentLessons = await db
        .insert(schema.lessons)
        .values([
          { unitId: units[0].id, title: "Stocks vs Bonds", order: 1 },
          { unitId: units[0].id, title: "Risk vs Return", order: 2 },
          { unitId: units[0].id, title: "Compound Interest", order: 3 },
        ])
        .returning();

      const investmentChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: investmentLessons[0].id,
            type: "SELECT",
            question: "What is a stock?",
            order: 1,
          },
          {
            lessonId: investmentLessons[2].id,
            type: "SELECT",
            question: "What makes compound interest so powerful?",
            order: 1,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: investmentChallenges[0].id,
          text: "A share of ownership in a company",
          correct: true,
          imageSrc: "/finance/stock.svg",
        },
        {
          challengeId: investmentChallenges[0].id,
          text: "A loan to a company",
          correct: false,
          imageSrc: "/finance/loan.svg",
        },
        {
          challengeId: investmentChallenges[0].id,
          text: "A type of savings account",
          correct: false,
          imageSrc: "/finance/savings.svg",
        },
      ]);

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: investmentChallenges[1].id,
          text: "You earn interest on your interest",
          correct: true,
          imageSrc: "/finance/compound.svg",
        },
        {
          challengeId: investmentChallenges[1].id,
          text: "It has high interest rates",
          correct: false,
          imageSrc: "/finance/high-rate.svg",
        },
        {
          challengeId: investmentChallenges[1].id,
          text: "It's risk-free",
          correct: false,
          imageSrc: "/finance/risk-free.svg",
        },
      ]);
    }

    // ==================== COURSE 4: Economics & Market Analysis ====================
    const economicsCourse = courses.find(
      (course) => course.title === "Economics & Market Analysis"
    );
    if (economicsCourse) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: economicsCourse.id,
            title: "Microeconomics Fundamentals",
            description:
              "Understand individual market behavior and decision making",
            order: 1,
          },
          {
            courseId: economicsCourse.id,
            title: "Macroeconomics Overview",
            description: "Learn about national and global economic systems",
            order: 2,
          },
          {
            courseId: economicsCourse.id,
            title: "Market Analysis & Trends",
            description: "Analyze market conditions and economic indicators",
            order: 3,
          },
          {
            courseId: economicsCourse.id,
            title: "Taxation & Government Policy",
            description: "Understand how taxes and policies affect the economy",
            order: 4,
          },
        ])
        .returning();

      // Unit 1: Microeconomics Fundamentals
      const microLessons = await db
        .insert(schema.lessons)
        .values([
          { unitId: units[0].id, title: "Supply and Demand", order: 1 },
          { unitId: units[0].id, title: "Market Equilibrium", order: 2 },
          { unitId: units[0].id, title: "Consumer Behavior", order: 3 },
        ])
        .returning();

      const microChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: microLessons[0].id,
            type: "SELECT",
            question:
              "What happens to price when demand increases and supply stays the same?",
            order: 1,
          },
          {
            lessonId: microLessons[1].id,
            type: "SELECT",
            question: "Market equilibrium occurs when:",
            order: 1,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: microChallenges[0].id,
          text: "Price increases",
          correct: true,
          imageSrc: "/finance/price-up.svg",
        },
        {
          challengeId: microChallenges[0].id,
          text: "Price decreases",
          correct: false,
          imageSrc: "/finance/price-down.svg",
        },
        {
          challengeId: microChallenges[0].id,
          text: "Price stays the same",
          correct: false,
          imageSrc: "/finance/price-same.svg",
        },
      ]);

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: microChallenges[1].id,
          text: "Supply equals demand",
          correct: true,
          imageSrc: "/finance/equilibrium.svg",
        },
        {
          challengeId: microChallenges[1].id,
          text: "Supply exceeds demand",
          correct: false,
          imageSrc: "/finance/surplus.svg",
        },
        {
          challengeId: microChallenges[1].id,
          text: "Demand exceeds supply",
          correct: false,
          imageSrc: "/finance/shortage.svg",
        },
      ]);

      // Unit 4: Taxation & Government Policy
      const taxLessons = await db
        .insert(schema.lessons)
        .values([
          { unitId: units[3].id, title: "Types of Taxes", order: 1 },
          { unitId: units[3].id, title: "Tax Brackets and Rates", order: 2 },
          {
            unitId: units[3].id,
            title: "Tax Deductions and Credits",
            order: 3,
          },
        ])
        .returning();

      const taxChallenges = await db
        .insert(schema.challenges)
        .values([
          {
            lessonId: taxLessons[0].id,
            type: "SELECT",
            question: "Which type of tax is based on your income?",
            order: 1,
          },
          {
            lessonId: taxLessons[2].id,
            type: "SELECT",
            question:
              "What's the difference between a tax deduction and tax credit?",
            order: 1,
          },
        ])
        .returning();

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: taxChallenges[0].id,
          text: "Income tax",
          correct: true,
          imageSrc: "/finance/income-tax.svg",
        },
        {
          challengeId: taxChallenges[0].id,
          text: "Sales tax",
          correct: false,
          imageSrc: "/finance/sales-tax.svg",
        },
        {
          challengeId: taxChallenges[0].id,
          text: "Property tax",
          correct: false,
          imageSrc: "/finance/property-tax.svg",
        },
      ]);

      await db.insert(schema.challengeOptions).values([
        {
          challengeId: taxChallenges[1].id,
          text: "Deduction reduces taxable income, credit reduces tax owed",
          correct: true,
          imageSrc: "/finance/deduction-credit.svg",
        },
        {
          challengeId: taxChallenges[1].id,
          text: "They are the same thing",
          correct: false,
          imageSrc: "/finance/same.svg",
        },
        {
          challengeId: taxChallenges[1].id,
          text: "Credit reduces taxable income, deduction reduces tax owed",
          correct: false,
          imageSrc: "/finance/credit-deduction.svg",
        },
      ]);
    }

    console.log("Finance education seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw new Error("Failed to seed the database.");
  } finally {
    await client.end();
  }
};

main();
