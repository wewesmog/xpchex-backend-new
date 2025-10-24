import { House, SwatchBook, Users } from 'lucide-react';

interface Feature {
    id: number;
    title: string;
    excerpt: string;
    href: string;
    icon: React.ReactElement;
}

const features: Feature[] = [
    {
        id: 1,
        title: 'Room Layout Planning',
        excerpt: 'Sed eu quam id quam tristique phar etra ait tortor lorem. Suspendisse vel odio sit amet libero facilisis cillum.',
        href: '#',
        icon: <House />,
    },
    {
        id: 2,
        title: 'Client Collaboration',
        excerpt: 'Sed eu quam id quam tristique phar etra ait tortor lorem. Suspendisse vel odio sit amet libero facilisis cillum.',
        href: '#',
        icon: <Users />,
    },
    {
        id: 3,
        title: 'Style & Mood Tracking',
        excerpt: 'Sed eu quam id quam tristique phar etra ait tortor lorem. Suspendisse vel odio sit amet libero facilisis cillum.',
        href: '#',
        icon: <SwatchBook />,
    },
];

export default function FeatureSection() {
    return (
        <section className="py-16 lg:py-32">
            <div className="mx-auto w-full max-w-2xl px-6 lg:max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <div className="text-center lg:max-w-lg lg:text-left">
                            <h2 className="text-3xl/tight font-semibold tracking-tight sm:text-4xl/tight">Bold minimal interiors</h2>
                            <p className="text-muted-foreground mt-4 text-base/7 sm:text-lg/8">
                                Quisque aliquet sit amet magna sit amet. Etiam posuere tellus sed magna efficitur tincidunt metus lorem gravida.
                            </p>
                            <div className="mt-12 flex flex-col items-center gap-8 text-left lg:items-start">
                                {features.map((feature: Feature) => (
                                    <div key={feature.id} className="flex gap-8">
                                        <div className="bg-primary text-primary-foreground inline-flex size-11 flex-none items-center justify-center rounded-md shadow-sm [&_svg]:size-4">
                                            {feature.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="-mt-1 text-lg font-semibold tracking-tight">{feature.title}</h3>
                                            <p className="text-muted-foreground mt-2 max-w-sm text-sm/6">{feature.excerpt}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col">
                            <img
                                className="ml-auto aspect-[4/3] w-[75%] rounded-xl object-cover object-center shadow-sm lg:aspect-[4/4]"
                                src="https://blookie.io/stock/features-3-1.webp"
                                alt=""
                            />
                            <img
                                className="-mt-[25%] aspect-[4/3] w-[75%] rounded-xl object-cover object-center shadow-sm"
                                src="https://blookie.io/stock/features-3-2.webp"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}