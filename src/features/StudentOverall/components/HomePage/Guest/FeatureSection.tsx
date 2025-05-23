import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn";
import { featureSectionItems, HOME_PAGE } from "@/features/StudentOverall/constants/homePageStrings";

export function FeatureSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-appPrimary/10 text-appPrimary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{HOME_PAGE.FEATURES.TITLE}</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {HOME_PAGE.FEATURES.DESCRIPTION}
            </p>
          </div>
        </div>
        <div className="grid max-w-5xl grid-cols-1 gap-6 py-12 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {featureSectionItems.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full text-appPrimary bg-appPrimary/10">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
