import Together from "together-ai"

export interface AIInsight {
  title: string
  content: string
  timestamp: string
}

/**
 * Generates AI-driven content for Solana-related analysis.
 * 
 * @param analysisType - "sentiment" or "promotional"
 * @param inputData - Array of post strings for sentiment analysis, or a prompt snippet for promotional text
 */
export async function generateMarketInsights(
  analysisType: "sentiment" | "promotional",
  inputData: string[] | string
): Promise<AIInsight[]> {
  try {
    // Hardcoded Together AI API key as requested
    const togetherApiKey = "0bf2f98a6e7769143bb880306b568aeb2439a3407ed6f2c222df030fb6e62250"

    // Instantiate Together with the hardcoded API key as a string
    const together = new Together({ apiKey: togetherApiKey })

    // Build the prompt dynamically based on the requested analysis type.
    const prompt = buildPrompt(analysisType, inputData)

    // Use the Together chat API as per the reference.
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    })

    // Extract the output text from the response.
    const aiText = response.choices?.[0]?.message?.content || ""

    // Parse the AI output into structured insights.
    const parsedInsights = parseInsightsFromText(aiText)

    return parsedInsights.map((insight) => ({
      ...insight,
      timestamp: "Generated just now",
    }))
  } catch (error) {
    console.error("Error generating AI insights:", error)
    // Return fallback (mock) insights if an error occurs.
    return getMockInsights(analysisType)
  }
}

/**
 * Constructs a prompt for the chosen analysis type.
 * 
 * - "sentiment": analyze multiple posts for Solana token sentiment.
 *   The prompt now dynamically states the number of posts (X posts) provided.
 * - "promotional": generate promotional text for Solana projects.
 */
function buildPrompt(analysisType: "sentiment" | "promotional", inputData: string[] | string): string {
  if (analysisType === "sentiment" && Array.isArray(inputData)) {
    const postCount = inputData.length
    // Concatenate posts with numbering for context.
    const joinedPosts = inputData.map((post, i) => `Post ${i + 1}: ${post}`).join("\n")
    return `Analyze the following ${postCount} Solana-related posts for sentiment (positive, negative, neutral), and provide an overall summary:
    
${joinedPosts}

Format the response as a series of JSON-like sections, each with:
1. A title describing the post or the summary
2. A content paragraph with details (e.g., positivity score, sentiment reasoning, etc.)
`
  } else if (analysisType === "promotional" && typeof inputData === "string") {
    return `Generate compelling promotional text for a Solana project. Use the following context:
    
"${inputData}"

Format the response in JSON-like sections with:
1. A title
2. A content paragraph describing the promotional pitch
`
  }
  // Fallback prompt if invalid input is provided.
  return `Generate three generic Solana insights. Format each insight with a title and content.`
}

/**
 * Parses AI-generated text into structured AIInsight objects.
 * This is a simplified parser. In production, consider more robust parsing or JSON validation.
 */
function parseInsightsFromText(text: string): Omit<AIInsight, "timestamp">[] {
  // Naively split on blank lines to separate sections.
  const sections = text.split(/\n\s*\n/)
  return sections
    .map((section) => {
      const lines = section.trim().split("\n")
      const title = lines[0]?.replace(/^\d+\.\s*/, "").replace(/[:#]/, "").trim()
      const content = lines.slice(1).join(" ").trim()
      return { title, content }
    })
    .filter((insight) => insight.title && insight.content)
}

/**
 * Returns mock insights when the API is unavailable or on error.
 */
function getMockInsights(analysisType: "sentiment" | "promotional"): AIInsight[] {
  if (analysisType === "sentiment") {
    return [
      {
        title: "Sentiment Analysis: Post 1",
        content: "Positive sentiment about Solana’s performance, praising recent price growth.",
        timestamp: "Generated 2 hours ago (mock data)",
      },
      {
        title: "Sentiment Analysis: Post 2",
        content: "Neutral sentiment with cautious optimism regarding upcoming Solana NFT launches.",
        timestamp: "Generated 2 hours ago (mock data)",
      },
      {
        title: "Overall Sentiment",
        content: "Mixed but generally leaning positive, with excitement around DeFi developments.",
        timestamp: "Generated 2 hours ago (mock data)",
      },
    ]
  }
  // For promotional insights.
  return [
    {
      title: "Promotional Text: Feature Highlights",
      content:
        "Solana’s high-speed transactions and low fees make it an ideal platform for next-generation DApps, providing users with seamless experiences.",
      timestamp: "Generated 2 hours ago (mock data)",
    },
    {
      title: "Promotional Text: Community Engagement",
      content:
        "Join our thriving Solana community to gain early access to innovative DeFi protocols, NFTs, and gaming projects, all backed by rapid transaction times.",
      timestamp: "Generated 2 hours ago (mock data)",
    },
    {
      title: "Promotional Text: Ecosystem Growth",
      content:
        "With major partnerships and continuous upgrades, Solana’s ecosystem is poised for long-term expansion, offering endless opportunities for builders and investors alike.",
      timestamp: "Generated 2 hours ago (mock data)",
    },
  ]
}
