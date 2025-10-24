import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

const faq: FaqItem[] = [
    {
        id: '1',
        question: 'How do I create an account?',
        answer: "To create an account, click on the 'Sign Up' button in the top right corner of our homepage. Fill in your details, verify your email address, and you're all set to go!",
    },
    {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer invoicing options.',
    },
    {
        id: '3',
        question: 'Can I cancel my subscription at any time?',
        answer: "Yes, you can cancel your subscription at any time. Go to your account settings, select 'Subscription', and click on 'Cancel Subscription'. Your access will continue until the end of your current billing period.",
    },
    {
        id: '4',
        question: 'How do I reset my password?',
        answer: "To reset your password, click on the 'Login' button, then select 'Forgot Password'. Enter your email address, and we'll send you instructions on how to create a new password.",
    },
];

export default function FaqSection() {
    return (
        <section className="py-16 lg:py-32">
            <div className="mx-auto w-full max-w-2xl px-6 lg:max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <img className="aspect-[16/9] rounded-xl object-cover object-center lg:aspect-[4/4]" src="https://blookie.io/stock/faqs-3-1.webp" />
                    </div>
                    <div>
                        <div className="max-w-lg lg:ml-auto">
                            <h2 className="text-3xl/tight font-semibold tracking-tight sm:text-4xl/tight">Looking for answers?</h2>
                            <div className="mt-12">
                                <Accordion type="single" defaultValue="1" collapsible className="-mt-4 w-full space-y-6">
                                    {faq.map((item: FaqItem) => (
                                        <AccordionItem key={item.id} value={item.id}>
                                            <AccordionTrigger className="hover:no-underline hover:opacity-75 lg:text-lg">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground text-sm/6">{item.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}