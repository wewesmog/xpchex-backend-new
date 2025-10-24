interface Stat {
    id: number;
    description: string;
    number: string;
}

const stats: Stat[] = [
    {
        id: 1,
        number: '18M+',
        description: "We've reached over 18 million users around the world.",
    },
    {
        id: 2,
        number: '40M+',
        description: 'One of the most downloaded apps on Google and the App Store.',
    },
    {
        id: 3,
        number: '96%',
        description: 'Customer satisfaction rate across all supported platforms.',
    },
];

export default function StatSection() {
    return (
        <section className="py-16">
            <div className="mx-auto w-full max-w-2xl px-6 lg:max-w-7xl">
                <div className="bg-secondary grid gap-0.5 lg:grid-cols-3">
                    {stats.map((stat: Stat) => (
                        <div key={stat.id} className="bg-background flex justify-center p-6 text-center">
                            <div>
                                <div className="text-4xl font-bold tracking-tight">{stat.number}</div>
                                <div className="text-muted-foreground mt-4 max-w-64 text-sm/6">{stat.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}