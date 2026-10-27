import { l } from './content-types';
import type { Copy4 } from './content-types';

export const EN: Copy4 = {
    announcement: {
        label: l("New"),
        text: l("Cekat.AI customer stories, with the numbers"),
        cta: l("Read the stories"),
        href: l("/en/stories")
    },
    live: {
        eyebrow: l("LIVE IN THE APP"),
        heading: "An inbox that runs",
        accent: "around the clock",
        body: l("There is no screen recording on this page. What follows is the product itself, built so it can be operated — not an image pretending to be a capture."),
        url: l("app.cekat.ai / inbox")
    },
    photos: {
        eyebrow: l("IN THE FIELD"),
        heading: "It runs in the warehouse,",
        accent: "at the desk, and on the road.",
        body: l("The same claims as above — happening where the goods actually move.")
    },
    api: {
        eyebrow: l("OPEN API"),
        heading: "Not a black box",
        accent: "you are asked to trust.",
        body: l("Connect Cekat.AI to your own stack: send a message, create an order, read a customer."),
        note: l("Illustrative example — the real endpoints and fields are in the docs."),
        cta: l("Read the docs")
    },
    hero: {
        pill: l("New · WhatsApp calls answered by AI", "New · WhatsApp calls answered by AI"),
        lead: "Every chat becomes a",
        accent: "customer who comes back",
        sub: l("Cekat.AI answers WhatsApp, Instagram, and TikTok in seconds, chases the ones who haven't paid, and writes the customer record while it talks. Your team only takes the chats that are ready to close."),
        primary: l("Start your free trial"),
        secondary: l("See it working"),
        note: l("Free for 14 days · No credit card · Live in 10 minutes"),
        stats: [
            {
                value: l("1.8s"),
                label: l("average AI reply")
            },
            {
                value: l("92%"),
                label: l("chat handled without a person")
            },
            {
                value: l("+34%"),
                label: l("chats turning into buyers")
            }
        ]
    },
    proof: {
        heading: "Trusted by teams behind millions of conversations",
        stats: [
            {
                value: l("10M+"),
                label: l("conversations assisted every month")
            },
            {
                value: l("3,000+"),
                label: l("businesses in Indonesia, Singapore & Malaysia")
            },
            {
                value: l("<2 min"),
                label: l("average first response")
            }
        ],
        logosLabel: l("Trusted by"),
        logosNote: l("A sample of the brands running sales and customer service on Cekat.AI.")
    },
    useCases: {
        eyebrow: l("USE CASES"),
        heading: "Four moments that cost the most",
        accent: "when nobody is watching",
        body: l("Not a feature list. Four situations that decide what a customer is worth."),
        items: [
            {
                key: l("A chat lands at 2am", "A chat lands at 2am"),
                rail: l("First response"),
                title: l("A chat lands at 2am", "A chat lands at 2am"),
                body: l("Nobody is awake at 2am. But a buyer comparing prices goes to whoever answers. The AI replies in seconds, in your words, from your price list and your shipping rules."),
                points: [
                    l("First reply in seconds, not hours"),
                    l("Answers drawn from your own information"),
                    l("Handed to a human the moment it needs one")
                ],
                figure: l("8 sec"),
                figureLabel: l("average first reply"),
                surface: "inbox",
                path: l("app.cekat.ai / inbox")
            },
            {
                key: l("A customer comes back", "A customer comes back"),
                rail: l("Customer records"),
                title: l("A customer comes back", "A customer comes back"),
                body: l("A second visit should not start from zero. Preferences, order history, and things already discussed assemble themselves from the conversation — not from a form filled in again."),
                points: [
                    l("Profile assembled from chat"),
                    l("One record across every channel"),
                    l("Segments update as customers move")
                ],
                figure: l("92%"),
                figureLabel: l("chat handled without a person"),
                surface: "profile",
                path: l("app.cekat.ai / customers")
            },
            {
                key: l("A buyer says yes", "A buyer says yes"),
                rail: l("Orders & payments"),
                title: l("A buyer says yes", "A buyer says yes"),
                body: l("The order closes in the chat where it happened. Shipping is calculated, the payment link goes out, the receipt comes with it, and status is tracked to delivery — without leaving the conversation."),
                points: [
                    l("Shipping calculated inside the chat"),
                    l("Payment link sent on the spot"),
                    l("Status tracked through delivery")
                ],
                figure: l("+34%"),
                figureLabel: l("chats turning into buyers"),
                surface: "order",
                path: l("app.cekat.ai / orders")
            },
            {
                key: l("A segment goes quiet", "A segment goes quiet"),
                rail: l("Promos & campaigns"),
                title: l("A segment goes quiet", "A segment goes quiet"),
                body: l("You know who bought what. So the next message can go to people who will actually buy it — not to everyone. Ad spend and the revenue it produced sit on the same report."),
                points: [
                    l("Segments built from real order history"),
                    l("Spend and revenue on one report"),
                    l("Reorder prompts sent before a customer lapses")
                ],
                figure: l("4.8×"),
                figureLabel: l("revenue against ad spend, 30 days"),
                surface: "campaign",
                path: l("app.cekat.ai / campaigns")
            }
        ]
    },
    workflow: {
        eyebrow: l("THE WORKFLOW"),
        heading: "From first chat to",
        accent: "the customer who buys again",
        body: l("Four steps. None of them is a project, and none of them needs a developer."),
        steps: [
            {
                index: l("01 / CONNECT"),
                title: l("Connect your channels"),
                body: l("WhatsApp, Instagram, TikTok, and website chat flow into one inbox. The number stays yours."),
                hint: l("~10 minutes")
            },
            {
                index: l("02 / TEACH"),
                title: l("Paste your business information"),
                body: l("Your price list, stock, policies, and the answers you give most. The AI answers from here rather than inventing."),
                hint: l("No code")
            },
            {
                index: l("03 / RUN"),
                title: l("Let the AI run"),
                body: l("The AI answers, sorts out who is serious, records the customer, and passes to your team only when a deal is close."),
                hint: l("Around the clock")
            },
            {
                index: l("04 / MEASURE"),
                title: l("Scale what works"),
                body: l("Clearly visible which channel, ad, and segment pays back. The ones that don't get fixed."),
                hint: l("Real time")
            }
        ]
    },
    capabilities: {
        eyebrow: l("CAPABILITIES"),
        heading: "What the product",
        accent: "actually does",
        body: l("Four capabilities. Each one works on its own without the other three."),
        items: [
            {
                title: l("Automatic replies"),
                body: l("The AI answers repeat questions from your own sources, and stops and hands over the moment one is needed."),
                points: [
                    l("Hands over to a human automatically"),
                    l("Answers in your own voice")
                ],
                href: l("See automatic replies")
            },
            {
                title: l("Customer records"),
                body: l("History, preferences, and lifetime value assemble themselves from the conversation. No end-of-day recap."),
                points: [
                    l("One record across channels"),
                    l("Segments ready to use")
                ],
                href: l("See how records build")
            },
            {
                title: l("Orders & payments"),
                body: l("Orders, payments, and shipping run inside the conversation. No fourth app to open."),
                points: [
                    l("QRIS and bank transfer"),
                    l("Status through to delivery")
                ],
                href: l("See how orders run")
            },
            {
                title: l("Segment campaigns"),
                body: l("Broadcasts go to the right segment, and the result is measured against what you spent."),
                points: [
                    l("Segments from real history"),
                    l("Spend vs revenue report")
                ],
                href: l("See how campaigns work")
            }
        ]
    },
    cases: {
        eyebrow: l("CASE STUDIES"),
        heading: "Four businesses,",
        accent: "every figure reported by the customer",
        body: l("Every number below came from the customer themselves. Not our claim, not a guess."),
        items: [
            {
                quote: l("I used to stay up late replying to them. Now I sleep fine, and by morning there is already a queue of people asking for survey slots. Sales are up by almost 50%."),
                name: "Adam Sulaiman",
                role: l("President Director"),
                company: "Threeland Property",
                photo: "/images/crm/adam-sulaiman.png",
                alt: l("Portrait of Adam Sulaiman, President Director of Threeland Property"),
                result: l("Sales up by almost 50%"),
                value: l("+50%"),
                valueLabel: l("sales growth"),
                href: l("/en/stories/threeland")
            },
            {
                quote: l("Our response rate went up 90%."),
                name: "Hargyo T. N. Ignatis",
                role: l("Director"),
                company: "Multimedia Nusantara Polytechnic",
                photo: "/images/home/testimonial-hargyo.jpg",
                alt: l("Portrait of Hargyo T. N. Ignatis, Director of Multimedia Nusantara Polytechnic"),
                result: l("Response rate up 90%"),
                value: l("+90%"),
                valueLabel: l("response rate gain"),
                href: l("/en/stories/nature-craft")
            },
            {
                quote: l("Now AMIRA answers around the clock, in under a minute."),
                name: "Wiji Astuti",
                role: l("Head of Customer Experience"),
                company: "Rumah Zakat",
                photo: "/images/home/testimonial-wiji-astuti.jpg",
                alt: l("Portrait of Wiji Astuti, Head of Customer Experience at Rumah Zakat"),
                result: l("Answered around the clock, under a minute"),
                value: l("<1 min"),
                valueLabel: l("average first reply"),
                href: l("/en/stories/rumah-zakat")
            },
            {
                quote: l("Customer responses became much faster."),
                name: "Silcia Brenda",
                role: l("CEO & Founder"),
                company: "Moir Salon",
                photo: "/images/home/testimonial-silica-brenda.jpg",
                alt: l("Portrait of Silcia Brenda, CEO & Founder of Moir Salon"),
                result: l("Customer responses much faster"),
                value: l("8 sec"),
                valueLabel: l("average first reply"),
                href: l("/en/stories/nature-craft")
            }
        ]
    },
    statement: {
        eyebrow: l("ONE SENTENCE"),
        line1: "Every customer question gets",
        accent: "three seconds to be answered",
        note: l("The one limit Cekat.AI never misses — noon, night, or midnight on a holiday.")
    },
    voices: {
        eyebrow: l("IN THEIR WORDS"),
        heading: "What they say",
        accent: "after running it",
        quote: l("I used to stay up late replying to them. Now I sleep fine, and by morning there is already a queue of people asking for survey slots."),
        name: "Adam Sulaiman",
        role: l("President Director"),
        company: "Threeland Property"
    },
    trust: {
        eyebrow: l("SECURITY & CONTROL"),
        heading: "What you hold,",
        accent: "and what you can prove",
        body: l("Customer data, team access, and channel connections are designed to keep your business in control."),
        badges: [
            {
                label: l("Indonesia PDP Law"),
                note: l("Handled under")
            },
            {
                label: l("Official Meta Partner"),
                note: l("Official path")
            },
            {
                label: l("ISO 9001 & 27001"),
                note: l("Certified")
            },
            {
                label: l("Role-based access"),
                note: l("Different teams, different views")
            }
        ],
        points: [
            {
                title: l("The number stays yours"),
                body: l("Your WhatsApp number stays connected to your business and can be moved at any time. No locking contract.")
            },
            {
                title: l("Download your data any time"),
                body: l("Customer history and orders can be taken in full at any time, in a format you can use elsewhere.")
            },
            {
                title: l("Access set by role"),
                body: l("Sales, support, and finance each see their own part. You decide the rules.")
            },
            {
                title: l("Official integrations"),
                body: l("WhatsApp connects through the official API with Meta-approved templates.")
            }
        ]
    },
    faq: {
        eyebrow: l("FAQ"),
        heading: "Questions before you start",
        items: [
            {
                q: "How long until it is live?",
                a: "Most businesses are answering chats the same day. Connect your channels, paste your price list and common answers, turn it on."
            },
            {
                q: "Do I have to take all of it at once?",
                a: "No. Start with automatic replies. Customer records, campaigns, and orders follow once the team is comfortable — all in the same place."
            },
            {
                q: "We have no IT. Does this still work?",
                a: "Yes. What it needs is your business information pasted in. The Cekat.AI team sits with you during setup."
            },
            {
                q: "What if the AI answers wrong?",
                a: "You hold the sources it answers from. Anything sensitive or out of scope goes straight to a person, with the conversation attached."
            }
        ]
    },
    pricing: {
        eyebrow: l("CHOOSE YOUR PLAN"),
        heading: "Start with what you need",
        body: l("Try everything for 14 days. No credit card required."),
        plans: [
            {
                name: l("Pro"),
                price: l(""),
                period: l(""),
                note: l("For small teams already drowning in replies"),
                featuredLabel: l("Most chosen"),
                points: [
                    l("1 official WhatsApp number"),
                    l("3,000 chats per month"),
                    l("15,000 AI replies per month"),
                    l("5 team seats")
                ],
                cta: l("Start your free trial")
            },
            {
                name: l("Business"),
                price: l(""),
                period: l(""),
                note: l("For teams that want it fully automatic"),
                featured: true,
                featuredLabel: l("Most chosen"),
                points: [
                    l("3 official WhatsApp numbers"),
                    l("10,000 chats per month"),
                    l("50,000 AI replies per month"),
                    l("7 team seats"),
                    l("Orders, payments & follow-ups")
                ],
                cta: l("Start your free trial")
            },
            {
                name: l("Enterprise"),
                price: l(""),
                period: l(""),
                note: l("For structured teams and corporate scale"),
                featuredLabel: l("Talk to us"),
                points: [
                    l("5 official WhatsApp numbers"),
                    l("30,000 chats per month"),
                    l("150,000 AI replies per month"),
                    l("10 team seats"),
                    l("Role-based access & audit log")
                ],
                cta: l("Talk to sales")
            }
        ],
        footnote: l("No long-term commitment. Change plans as your team's needs change."),
        compare: l("Compare all plans")
    },
    finalCta: {
        eyebrow: l("START TODAY"),
        heading: "Make every chat",
        accent: "count.",
        body: l("See how Cekat helps teams serve customers and grow the business."),
        primary: l("Start your free trial"),
        secondary: l("Talk to sales"),
        checks: [
            l("Live in 10 minutes"),
            l("Set up with our team"),
            l("Cancel any time")
        ]
    }
};

