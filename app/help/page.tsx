import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new token?",
      answer:
        "To create a new token, navigate to the 'Create Token' page from the sidebar. Fill in the required information such as token name, symbol, and initial supply. You can also configure advanced options like decimals and token features (mintable, burnable, etc.).",
    },
    {
      question: "How do I connect my wallet?",
      answer:
        "Click on the 'Wallet' option in the sidebar. You'll be presented with options to connect popular Solana wallets like Phantom, Solflare, or Backpack. Follow the prompts to connect your wallet securely.",
    },
    {
      question: "What are the fees for creating a token?",
      answer:
        "Creating a token on Solana requires SOL to pay for the transaction fees and rent for the token account. The exact amount varies but is typically around 0.005-0.01 SOL. Our platform doesn't charge additional fees beyond the network fees.",
    },
    {
      question: "How do I set up the Discord/Telegram bot?",
      answer:
        "Go to the Settings page and navigate to the 'Bot Settings' tab. Enter your Discord Bot Token, Client ID, and/or Telegram Bot Token. Click 'Save Settings' and then 'Initialize Bots' to start the bots. Make sure you've created the bots on the respective platforms first.",
    },
    {
      question: "What commands can I use with the bots?",
      answer:
        "The bots support several commands: '/create' to initiate a token creation process, '/stats' to get real-time Solana market insights, and '/help' to see all available commands and their descriptions.",
    },
    {
      question: "How accurate are the AI-powered insights?",
      answer:
        "Our AI insights are generated using advanced language models and current market data. While they provide valuable analysis, they should not be considered financial advice. Always do your own research before making investment decisions.",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Help & Support" text="Find answers to common questions and get support." />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Comprehensive guides and tutorials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Getting Started</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Platform Overview
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Creating Your First Token
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Understanding Token Parameters
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Bot Integration</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Setting Up Discord Bot
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Setting Up Telegram Bot
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Bot Commands Reference
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Advanced Topics</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Token Economics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Solana Agent Kit Integration
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    AI-Powered Market Analysis
                  </Link>
                </li>
              </ul>
            </div>

            <Button className="w-full" variant="outline" asChild>
              <Link href="#">View Full Documentation</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get help from our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Support Channels</h3>
              <p className="text-sm">
                Our support team is available through multiple channels to assist you with any issues or questions.
              </p>
              <div className="grid gap-2 mt-4">
                <Button className="w-full" asChild>
                  <Link href="mailto:support@solanatokenassistant.com">Email Support</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="https://discord.gg/solanatokenassistant">Join Discord Community</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="https://t.me/solanatokenassistant">Telegram Support Group</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="font-medium">Support Hours</h3>
              <p className="text-sm">
                Our team is available Monday through Friday, 9 AM to 5 PM UTC. For urgent issues, we provide 24/7
                support through our Discord community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}

